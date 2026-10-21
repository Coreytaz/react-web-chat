import { useEffect, useLayoutEffect, useRef } from 'react'
import type { ChatMessage } from '../../types/Chat.interface'
interface MessageScrollOptions {
  messages: ChatMessage[]
  hasMore: boolean
  fetchingOlder: boolean
  isLoading: boolean
  error: Error | null
  loadMore: () => void
}
export function useMessageScroll({
  messages,
  hasMore,
  fetchingOlder,
  isLoading,
  error,
  loadMore
}: MessageScrollOptions) {
  const container = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const previous = useRef({ height: 0, first: '', last: '' })
  const shouldFollow = useRef(true)
  useEffect(() => {
    const node = top.current
    if (!node || !hasMore || fetchingOlder || isLoading || error) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore()
      },
      { root: container.current }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, fetchingOlder, isLoading, error, loadMore])
  useLayoutEffect(() => {
    const node = container.current
    if (!node) return
    const first = messages[0]?.id || ''
    const last = messages.at(-1)?.id || ''
    const old = previous.current
    if (old.first && old.first !== first && messages.some((message) => message.id === old.first))
      node.scrollTop += node.scrollHeight - old.height
    else if (shouldFollow.current && old.last !== last)
      bottom.current?.scrollIntoView({ block: 'end' })
    previous.current = { height: node.scrollHeight, first, last }
  }, [messages])
  const onScroll = () => {
    const node = container.current
    if (node) shouldFollow.current = node.scrollHeight - node.scrollTop - node.clientHeight < 100
  }
  return { container, top, bottom, onScroll }
}
