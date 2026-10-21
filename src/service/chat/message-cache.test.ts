import { describe, it, expect } from 'vitest'
import { emptyEvents, mergeMessages, type MessagePage } from './message-cache'
import type { ChatMessage } from '../../types/Chat.interface'
const message = (id: string, text = id): ChatMessage => ({
  id,
  message: text,
  fromSelf: false,
  createdAt: '2026-10-21T10:00:00Z',
  updatedAt: '2026-10-21T10:00:00Z'
})
describe('history and socket reconciliation', () => {
  it('deduplicates overlapping pages and a message received while fetching', () => {
    const events = emptyEvents()
    events.revision = 1
    events.added.c = { revision: 1, message: message('c') }
    const pages: MessagePage[] = [
      { messages: [message('b'), message('c')], revision: 0, page: 0 },
      { messages: [message('a'), message('b')], revision: 0, page: 1 }
    ]
    expect(mergeMessages(pages, events).map((m) => m.id)).toEqual(['a', 'b', 'c'])
  })
  it('preserves updates and deletions received during a request', () => {
    const events = emptyEvents()
    events.updated.a = {
      revision: 1,
      message: { _id: 'a', message: 'changed', updatedAt: '2026-10-21T11:00:00Z' }
    }
    events.removed.b = 2
    expect(
      mergeMessages([{ messages: [message('a'), message('b')], revision: 0, page: 0 }], events)
    ).toEqual([expect.objectContaining({ id: 'a', message: 'changed' })])
  })
  it('does not resurrect old socket messages after an authoritative refresh', () => {
    const events = emptyEvents()
    events.revision = 2
    events.added.a = { revision: 1, message: message('a') }
    expect(mergeMessages([{ messages: [], revision: 2, page: 0 }], events)).toEqual([])
  })
})
