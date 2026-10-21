import { act, renderHook } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import type { ServerEvents } from '../types/Chat.interface'
import { harness } from '../test/helpers'
import { authActions } from '../redux/slice/authSlice'
import { emptyEvents, eventKey, type MessageEvents } from '../service/chat/message-cache'
const mock = vi.hoisted(() => {
  type Listener = (...args: unknown[]) => void
  const listeners = new Map<string, Set<Listener>>()
  return {
    listeners,
    on: vi.fn((event: string, listener: Listener) => {
      const list = listeners.get(event) ?? new Set()
      list.add(listener)
      listeners.set(event, list)
    }),
    off: vi.fn((event: string, listener: Listener) => listeners.get(event)?.delete(listener)),
    emit: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn()
  }
})
vi.mock('../service/chat/socket.service', () => ({ default: mock }))
import { useChat } from './useChat'
function receive<K extends keyof ServerEvents>(event: K, ...args: Parameters<ServerEvents[K]>) {
  act(() => mock.listeners.get(event)?.forEach((fn) => fn(...args)))
}
beforeEach(() => {
  mock.listeners.clear()
  vi.clearAllMocks()
})
describe('socket lifecycle', () => {
  it('registers on every reconnect and cleans up exact callbacks', () => {
    const h = harness()
    const { unmount } = renderHook(useChat, { wrapper: h.wrapper })
    receive('connect')
    receive('connect')
    expect(mock.emit).toHaveBeenCalledTimes(2)
    expect(mock.emit).toHaveBeenCalledWith('ADD-USER', 'me')
    unmount()
    expect([...mock.listeners.values()].every((list) => list.size === 0)).toBe(true)
    expect(mock.disconnect).toHaveBeenCalledTimes(1)
  })
  it('disconnects when the session ends', () => {
    const h = harness()
    renderHook(useChat, { wrapper: h.wrapper })
    act(() => h.store.dispatch(authActions.isClear()))
    expect(mock.disconnect).toHaveBeenCalledTimes(1)
    expect([...mock.listeners.values()].every((list) => list.size === 0)).toBe(true)
  })
  it('shows backend operation errors', () => {
    const h = harness()
    renderHook(useChat, { wrapper: h.wrapper })
    receive('operation:error', { code: '403', message: 'Можно изменять только свои сообщения' })
    expect(h.store.getState().toastSlice.toastlist).toEqual([
      expect.objectContaining({
        title: 'Ошибка',
        description: 'Можно изменять только свои сообщения'
      })
    ])
  })
  it('routes messages to their conversation and deduplicates repeated events', () => {
    const h = harness()
    renderHook(useChat, { wrapper: h.wrapper })
    const message = {
      id: 'a',
      from: 'other',
      to: 'me',
      message: 'Hello',
      createdAt: '2026-10-21T10:00:00Z',
      updatedAt: '2026-10-21T10:00:00Z',
      fromSelf: false
    }
    receive('MESG-RECIEVE', message)
    receive('MESG-RECIEVE', message)
    expect(
      Object.keys(h.client.getQueryData<MessageEvents>(eventKey('me', 'other'))?.added ?? {})
    ).toEqual(['a'])
    expect(h.client.getQueryData(eventKey('me', 'unrelated'))).toBeUndefined()
  })
  it('handles clear with no payload by refetching, without clearing unrelated UI', () => {
    const h = harness()
    h.client.setQueryData(eventKey('me', 'other'), emptyEvents())
    const invalidate = vi.spyOn(h.client, 'invalidateQueries')
    renderHook(useChat, { wrapper: h.wrapper })
    receive('messages:clear-recieve')
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['messages', 'me'] })
    expect(h.client.getQueryData(eventKey('me', 'other'))).toEqual(emptyEvents())
  })
})
