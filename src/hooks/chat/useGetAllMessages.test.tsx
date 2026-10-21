import { act, renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse, delay } from 'msw'
import { describe, it, expect } from 'vitest'
import { server } from '../../test/setup'
import { harness } from '../../test/helpers'
import { useGetAllMessages } from './useGetAllMessages'
import { emptyEvents, eventKey } from '../../service/chat/message-cache'
const msg = (id: string) => ({
  id,
  message: id,
  fromSelf: false,
  createdAt: '2026-10-21T10:00:00Z',
  updatedAt: '2026-10-21T10:00:00Z'
})
describe('message history', () => {
  it('isolates late responses when the conversation changes', async () => {
    server.use(
      http.post('http://localhost/api/chat/getMessages', async ({ request }) => {
        const body = (await request.json()) as { to: string }
        if (body.to === 'old') await delay(80)
        return HttpResponse.json([msg(body.to)])
      })
    )
    const h = harness()
    const { result, rerender } = renderHook(({ to }) => useGetAllMessages('me', to), {
      initialProps: { to: 'old' },
      wrapper: h.wrapper
    })
    rerender({ to: 'new' })
    await waitFor(() => expect(result.current.messages[0]?.id).toBe('new'))
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(result.current.messages.map((m) => m.id)).toEqual(['new'])
  })
  it('keeps a live message received while the initial request is pending', async () => {
    server.use(
      http.post('http://localhost/api/chat/getMessages', async () => {
        await delay(60)
        return HttpResponse.json([msg('a')])
      })
    )
    const h = harness()
    const { result } = renderHook(() => useGetAllMessages('me', 'other'), { wrapper: h.wrapper })
    act(() =>
      h.client.setQueryData(eventKey('me', 'other'), {
        ...emptyEvents(),
        revision: 1,
        added: { b: { revision: 1, message: msg('b') } }
      })
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.messages.map((m) => m.id)).toEqual(['a', 'b'])
  })
  it('requests pages of 30 and stops after a short page', async () => {
    const pages: string[] = []
    server.use(
      http.post('http://localhost/api/chat/getMessages', ({ request }) => {
        const url = new URL(request.url)
        expect(url.searchParams.get('limit')).toBe('30')
        pages.push(url.searchParams.get('page') || '')
        return HttpResponse.json(
          url.searchParams.get('page') === '0'
            ? Array.from({ length: 30 }, (_, i) => msg(String(i).padStart(2, '0')))
            : [msg('older')]
        )
      })
    )
    const h = harness()
    const { result } = renderHook(() => useGetAllMessages('me', 'other'), { wrapper: h.wrapper })
    await waitFor(() => expect(result.current.hasNextPage).toBe(true))
    await act(() => result.current.fetchNextPage())
    expect(pages).toEqual(['0', '1'])
    await waitFor(() => expect(result.current.hasNextPage).toBe(false))
    expect(result.current.messages).toHaveLength(31)
  })
})
