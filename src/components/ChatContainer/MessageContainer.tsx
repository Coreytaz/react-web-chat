import { useMessageScroll } from '../../hooks/chat/useMessageScroll'
import type { ChatMessage, MessageUpdatePayload } from '../../types/Chat.interface'
import type { PublicUser } from '../../types/User.interface'
import Message from './Message'
import Loading from '../Loading/Loading'
import styles from './ChatContainer.module.scss'
import Robot from '../../assets/robot.gif'
interface Props {
  messages: ChatMessage[]
  isLoading: boolean
  error: Error | null
  fetchingOlder: boolean
  hasMore: boolean
  loadMore: () => void
  retry: () => void
  user: PublicUser
  editing: boolean
  onEdit: (message: MessageUpdatePayload) => void
}
export default function MessageContainer({
  messages,
  isLoading,
  error,
  fetchingOlder,
  hasMore,
  loadMore,
  retry,
  user,
  editing,
  onEdit
}: Props) {
  const { container, top, bottom, onScroll } = useMessageScroll({
    messages,
    hasMore,
    fetchingOlder,
    isLoading,
    error,
    loadMore
  })

  return (
    <div className={styles.message_inner} ref={container} onScroll={onScroll}>
      <div ref={top} style={{ height: 1 }} />
      {isLoading || fetchingOlder ? <Loading /> : null}
      {error ? (
        <p role="alert">
          Не удалось загрузить сообщения. <button onClick={retry}>Повторить</button>
        </p>
      ) : null}
      {messages.map((message) => (
        <Message key={message.id} {...message} editingState={editing} onEdit={onEdit} />
      ))}
      {!messages.length && !isLoading && !error ? (
        <div className={styles.welcome}>
          <img src={Robot} alt="" />
          <h2>
            У вас нет сообщений с пользователем, <span>{user.username}!</span>
          </h2>
          <h4>Чтобы начать разговор, напишите сообщение снизу</h4>
        </div>
      ) : null}
      <div ref={bottom} />
    </div>
  )
}
