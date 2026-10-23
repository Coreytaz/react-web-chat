import { act, renderHook, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse, delay } from 'msw'
import { describe, it, expect, vi } from 'vitest'
vi.mock('../../service/chat/socket.service', () => ({
  default: { on: vi.fn(), off: vi.fn(), emit: vi.fn(), connect: vi.fn(), disconnect: vi.fn() }
}))
import userEvent from '@testing-library/user-event'
import { server } from '../../test/setup'
import { harness, user } from '../../test/helpers'
import { useRefresh } from './useRefresh'
import { useLogout } from './useLogout'
import Home from '../../pages/Home'
import App from '../../App'
import Auth from '../../pages/Auth'
import { AuthService } from '../../service/auth.service'
import authReducer, { authActions } from '../../redux/slice/authSlice'
import type { AuthResponse } from '../../types/User.interface'

describe('invalid session responses', () => {
  it.each([{}, { user: null }, { user: {} }, '<!doctype html>'])(
    'rejects malformed auth data: %j',
    async (data) => {
      server.use(
        http.get('http://localhost/api/auth/refresh', () => HttpResponse.json(data)),
        http.post('http://localhost/api/auth/login', () => HttpResponse.json(data)),
        http.post('http://localhost/api/auth/register', () => HttpResponse.json(data))
      )
      await expect(AuthService.refresh()).rejects.toThrow('некорректные данные сессии')
      await expect(AuthService.login('tester', 'secret')).rejects.toThrow(
        'некорректные данные сессии'
      )
      await expect(AuthService.register('test@example.test', 'secret', 'tester')).rejects.toThrow(
        'некорректные данные сессии'
      )
      const authenticated = authReducer(undefined, authActions.isAuth({ user }))
      const state = authReducer(authenticated, authActions.isAuth(data as AuthResponse))
      expect(state.auth).toBe(false)
      expect(state.user._id).toBe('')
    }
  )

  it('shows a retryable error instead of crashing when refresh returns no user', async () => {
    server.use(http.get('http://localhost/api/auth/refresh', () => HttpResponse.json({})))
    const h = harness(false)
    h.render(<App />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось проверить сессию')
    expect(h.store.getState().authSlice.user._id).toBe('')
    expect(h.store.getState().authSlice.auth).toBe(false)
  })
})
describe('authentication', () => {
  it('waits for refresh before rendering a protected route and preserves sel on return', async () => {
    server.use(
      http.get('http://localhost/api/auth/refresh', async () => {
        await delay(30)
        return HttpResponse.json(null, { status: 401 })
      })
    )
    const h = harness(false, '/profile?sel=other')
    h.render(<App />)
    expect(screen.queryByRole('heading', { name: 'Вход React Chat' })).not.toBeInTheDocument()
    await screen.findByRole('heading', { name: 'Вход React Chat' })
    expect(h.store.getState().authSlice.auth).toBe(false)
  })
  it('restores the actual {user} response without a readable cookie hint', async () => {
    server.use(http.get('http://localhost/api/auth/refresh', () => HttpResponse.json({ user })))
    const h = harness(false)
    const { result } = renderHook(useRefresh, { wrapper: h.wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(h.store.getState().authSlice.user._id).toBe('me')
  })
  it('leaves network failures as retryable errors', async () => {
    server.use(http.get('http://localhost/api/auth/refresh', () => HttpResponse.error()))
    const h = harness(false)
    const { result } = renderHook(useRefresh, { wrapper: h.wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(h.store.getState().authSlice.auth).toBe(false)
  })
  it('clears account data and the cache after logout', async () => {
    server.use(
      http.get('http://localhost/api/auth/logout', () => new HttpResponse(null, { status: 200 }))
    )
    const h = harness()
    h.client.setQueryData(['messages', 'me', 'other'], ['private'])
    const { result } = renderHook(useLogout, { wrapper: h.wrapper })
    act(() => result.current.asyncLogout())
    await waitFor(() => expect(h.store.getState().authSlice.auth).toBe(false))
    expect(h.client.getQueryData(['messages', 'me', 'other'])).toBeUndefined()
    expect(h.client.getQueryData(['session'])).toBeNull()
  })
  it('submits with Enter and retains credentials after an offline error', async () => {
    let body: unknown
    server.use(
      http.post('http://localhost/api/auth/login', async ({ request }) => {
        body = await request.json()
        return HttpResponse.error()
      })
    )
    const h = harness(false)
    h.render(<Home />)
    const browser = userEvent.setup()
    await browser.type(screen.getByLabelText('E-mail или Логин'), 'tester')
    await browser.type(screen.getByLabelText('Пароль'), 'secret{Enter}')
    await waitFor(() => expect(body).toEqual({ EmailorLogin: 'tester', password: 'secret' }))
    await waitFor(() => expect(h.store.getState().toastSlice.toastlist).toHaveLength(1))
    expect(screen.getByLabelText('Пароль')).toHaveValue('secret')
    expect(screen.getByRole('button', { name: 'Войти' })).toBeEnabled()
  })
})

it('returns to the entire protected URL after a successful login', async () => {
  server.use(
    http.get('http://localhost/api/auth/refresh', () => HttpResponse.json(null, { status: 401 })),
    http.post('http://localhost/api/auth/login', () => HttpResponse.json({ user }))
  )
  const h = harness(false, '/profile?sel=other')
  h.render(<App />)
  const browser = userEvent.setup()
  await screen.findByRole('heading', { name: 'Вход React Chat' })
  await browser.type(screen.getByLabelText('E-mail или Логин'), 'tester')
  await browser.type(screen.getByLabelText('Пароль'), 'secret{Enter}')
  await screen.findByRole('heading', { name: 'Профиль: Тест' })
  expect(h.store.getState().authSlice.user._id).toBe('me')
})
it('expires the session on an authenticated API 401 and clears private caches', async () => {
  server.use(
    http.get('http://localhost/api/auth/refresh', () => HttpResponse.json({ user })),
    http.get('http://localhost/api/user/getFriends', () =>
      HttpResponse.json({ message: 'Expired' }, { status: 401 })
    )
  )
  const h = harness(false)
  h.client.setQueryData(['private', 'me'], 'private')
  h.render(<App />)
  await screen.findByRole('heading', { name: 'Вход React Chat' })
  expect(h.client.getQueryData(['private', 'me'])).toBeUndefined()
  expect(h.store.getState().authSlice.auth).toBe(false)
})

it('submits registration once and retains the form on a validation error', async () => {
  let count = 0
  let body: unknown
  server.use(
    http.post('http://localhost/api/auth/register', async ({ request }) => {
      count++
      body = await request.json()
      await delay(50)
      return HttpResponse.json(
        { message: ['Логин уже занят'], error: 'Bad Request' },
        { status: 400 }
      )
    })
  )
  const h = harness(false, '/auth')
  h.render(<Auth />)
  const browser = userEvent.setup()
  await browser.type(screen.getByLabelText('Почта'), 'test@example.test')
  await browser.type(screen.getByLabelText('Логин'), 'tester')
  await browser.type(screen.getByLabelText('Пароль'), 'secret')
  await browser.dblClick(screen.getByRole('button', { name: 'Зарегистрироваться' }))
  await waitFor(() => expect(h.store.getState().toastSlice.toastlist).toHaveLength(1))
  expect(count).toBe(1)
  expect(body).toEqual({ email: 'test@example.test', login: 'tester', password: 'secret' })
  expect(screen.getByLabelText('Логин')).toHaveValue('tester')
})
