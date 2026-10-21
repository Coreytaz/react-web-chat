import type { QueryClient } from '@tanstack/react-query'
import { emptyEvents, eventKey, type MessageEvents } from './message-cache'
import type { SocketMessage, StoredMessage } from '../../types/Chat.interface'
export function createMessageEventHandlers(client: QueryClient, id: string) {
  const receive = (data: SocketMessage) => {
    if (data.from !== id && data.to !== id) return
    const other = data.from === id ? data.to : data.from
    client.setQueryData<MessageEvents>(eventKey(id, other), (old) => {
      const state = old ?? emptyEvents()
      const revision = state.revision + 1
      return {
        ...state,
        revision,
        added: {
          ...state.added,
          [data.id]: { revision, message: { ...data, fromSelf: data.from === id } }
        }
      }
    })
  }
  const update = ({ updatedMessage: message }: { updatedMessage: StoredMessage | null }) => {
    if (!message) return
    client.setQueriesData<MessageEvents>({ queryKey: ['message-events', id] }, (old) => {
      if (!old) return old
      const revision = old.revision + 1
      return {
        ...old,
        revision,
        updated: { ...old.updated, [message._id]: { revision, message } }
      }
    })
  }
  const remove = ({ removedMessage: message }: { removedMessage: StoredMessage | null }) => {
    if (!message) return
    client.setQueriesData<MessageEvents>({ queryKey: ['message-events', id] }, (old) => {
      if (!old) return old
      const revision = old.revision + 1
      return { ...old, revision, removed: { ...old.removed, [message._id]: revision } }
    })
  }

  return { receive, update, remove }
}
