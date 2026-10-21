import { useCallback, useState } from 'react'
import Loading from '../Loading/Loading'
import { useGetUser } from '../../hooks/user/useGetUser'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import type { PublicUser } from '../../types/User.interface'
import type { MessageUpdatePayload } from '../../types/Chat.interface'
import { useGetAllMessages } from '../../hooks/chat/useGetAllMessages'
import MessageContainer from './MessageContainer'
import MessageHeader from './MessageHeader'
import ChatInput from './ChatInput'
import styles from './ChatContainer.module.scss'
import Robot from '../../assets/robot.gif'
function Conversation({ user }: { user: PublicUser }) {
  const id = useTypedSelector((s) => s.authSlice.user._id)
  const query = useGetAllMessages(id, user._id)
  const [editing, setEditing] = useState<MessageUpdatePayload | null>(null)
  const { fetchNextPage } = query
  const loadOlder = useCallback(() => {
    void fetchNextPage({ cancelRefetch: false })
  }, [fetchNextPage])
  return (
    <>
      <div className={styles.mesage_wrapper}>
        <MessageHeader user={user} />
        <MessageContainer
          messages={query.messages}
          isLoading={query.isPending}
          error={query.error}
          fetchingOlder={query.isFetchingNextPage}
          hasMore={!!query.hasNextPage && !query.isFetching}
          loadMore={loadOlder}
          retry={() => void query.refetch()}
          user={user}
          editing={!!editing}
          onEdit={setEditing}
        />
      </div>
      <ChatInput
        key={editing?.id || 'compose'}
        to={user._id}
        editing={editing}
        onCancel={() => setEditing(null)}
      />
    </>
  )
}
export default function ChatContainer() {
  const { userId, selectedUser, isFetching, error } = useGetUser()
  const username = useTypedSelector((s) => s.authSlice.user.username)
  if (!userId)
    return (
      <div className={styles.welcome}>
        <img src={Robot} alt="" />
        <h2>
          Добро пожаловать, <span>{username}!</span>
        </h2>
        <h4>Пожалуйста, выберите чат, чтобы начать разговор.</h4>
      </div>
    )
  if (error) return <p role="alert">Не удалось загрузить пользователя.</p>
  if (isFetching || !selectedUser) return <Loading />
  return <Conversation key={selectedUser._id} user={selectedUser} />
}
