import { Link, useNavigate } from 'react-router-dom'
import type { PublicUser } from '../../types/User.interface'
import Button from '../UI/Button/Button'
import UserBlock from './UserBlock'
import UserBlockReqSkeleton from './UserBlockReqSkeleton'
import styles from '../../style/Page/Friends.module.scss'
interface FriendRequestsProps {
  requests: PublicUser[]
  loading: boolean
  error: Error | null
  expanded: boolean
  onAccept: (id: string) => void
}
export default function FriendRequests({
  requests,
  loading,
  error,
  expanded,
  onAccept
}: FriendRequestsProps) {
  const navigate = useNavigate()
  const visible = expanded ? requests : requests.slice(0, 1)
  return (
    <div className={styles.friend__req_block}>
      <div className={styles.friend__req_header}>
        {expanded && <span onClick={() => navigate('/friends')}>Назад</span>}
        <h3>Заявки в друзья: {requests.length}</h3>
        {!expanded && <Link to="?section=requests">Показать все</Link>}
      </div>
      <div className={styles.friend__req_body}>
        {error ? (
          <p role="alert">Не удалось загрузить заявки.</p>
        ) : loading ? (
          <UserBlockReqSkeleton />
        ) : !requests.length ? (
          <p>Нет заявок в друзья</p>
        ) : (
          visible.map((user) => (
            <div className={styles.friend__req_user} key={user._id}>
              <div>
                <UserBlock {...user} />
              </div>
              <Button appearance="primary" onClick={() => onAccept(user._id)}>
                Добавить в друзья
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
