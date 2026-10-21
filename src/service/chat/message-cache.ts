import type { ChatMessage, StoredMessage } from '../../types/Chat.interface'
export interface MessageEvents {
  revision: number
  added: Record<string, { revision: number; message: ChatMessage }>
  updated: Record<string, { revision: number; message: StoredMessage }>
  removed: Record<string, number>
}
export interface MessagePage {
  messages: ChatMessage[]
  revision: number
  page: number
}
export const emptyEvents = (): MessageEvents => ({
  revision: 0,
  added: {},
  updated: {},
  removed: {}
})
export const eventKey = (id: string, to: string) => ['message-events', id, to] as const
export function mergeMessages(pages: MessagePage[], events: MessageEvents): ChatMessage[] {
  const all = new Map<string, ChatMessage>()
  const revision = pages[0]?.revision ?? -1
  for (const page of [...pages].reverse())
    for (const message of page.messages) all.set(message.id, message)
  for (const { revision: r, message } of Object.values(events.added))
    if (r > revision) all.set(message.id, message)
  for (const { revision: r, message } of Object.values(events.updated)) {
    const old = all.get(message._id)
    if (old && r > revision)
      all.set(message._id, {
        ...old,
        message: message.message,
        updatedAt: message.updatedAt,
        attachments: message.attachments
      })
  }
  for (const [id, r] of Object.entries(events.removed)) if (r > revision) all.delete(id)
  return [...all.values()].sort(
    (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt) || a.id.localeCompare(b.id)
  )
}
