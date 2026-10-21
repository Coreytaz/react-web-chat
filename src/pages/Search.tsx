import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/UI/Button/Button'
import UserList from '../components/UserBlock/UserList'
import UserSearchField from '../components/UserBlock/UserSearchField'
import { useSearchUsers } from '../hooks/user/useSearchUsers'
import { useFriendActions } from '../hooks/user/useFriendActions'
import { useTypedSelector } from '../hooks/useTypedSelector'
import styles from '../style/Page/Search.module.scss'
export default function Search() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const search = params.get('username') || ''
  const { userList, isFetching, error } = useSearchUsers()
  const id = useTypedSelector((state) => state.authSlice.user._id)
  const [sent, setSent] = useState<string[]>([])
  const { requestFriend } = useFriendActions()
  const request = (taker: string) => {
    if (requestFriend(taker)) setSent((old) => [...old, taker])
  }
  return (
    <div className={styles.friend__block}>
      <div className={styles.friend__header}>
        <span onClick={() => navigate('/friends')}>Назад</span>
        <h3>Все пользователи {userList?.total ?? 0}</h3>
      </div>
      <UserSearchField
        value={search}
        onChange={(username) => setParams(username ? { username } : {}, { replace: true })}
        placeholder="Введите запрос"
        className={styles.search__friends}
        clearClassName={styles.closeSearch}
      />
      <UserList
        users={userList?.items ?? []}
        loading={isFetching}
        error={error}
        errorMessage="Не удалось загрузить пользователей."
        className={styles.friends__list}
        rowClassName={styles.friends__user}
        skeletonCount={5}
        renderAction={(user) => (
          <Button
            appearance="primary"
            disabled={user.friends || sent.includes(user._id) || user._id === id}
            onClick={() => request(user._id)}
          >
            Добавить в друзья
          </Button>
        )}
        empty={
          <h2 style={{ textAlign: 'center' }}>
            😔
            <br />
            Не удалось найти пользователя
          </h2>
        }
      />
    </div>
  )
}
