import { useMemo } from 'react'
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChatService } from '../../service/chat/chat.service'
import { keys } from '../../service/query'
import {
  emptyEvents,
  eventKey,
  mergeMessages,
  type MessageEvents
} from '../../service/chat/message-cache'
export const useGetAllMessages = (from: string, to: string) => {
  const client = useQueryClient()
  const eventQuery = useQuery({
    queryKey: eventKey(from, to),
    queryFn: emptyEvents,
    enabled: false,
    initialData: emptyEvents
  })
  const query = useInfiniteQuery({
    queryKey: keys.messages(from, to),
    initialPageParam: 0,
    enabled: !!from && !!to,
    queryFn: async ({ pageParam, signal }) => {
      const revision = client.getQueryData<MessageEvents>(eventKey(from, to))?.revision ?? 0
      const { data } = await ChatService.getAllMessage(from, to, pageParam, 30, signal)
      return { messages: data, revision, page: pageParam }
    },
    getNextPageParam: (last) => (last.messages.length === 30 ? last.page + 1 : undefined)
  })
  const pages = query.data?.pages
  const messages = useMemo(
    () => mergeMessages(pages ?? [], eventQuery.data),
    [pages, eventQuery.data]
  )
  return { ...query, messages }
}
