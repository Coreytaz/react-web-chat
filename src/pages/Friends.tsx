import { Link, useSearchParams } from 'react-router-dom'
import Button from '../components/UI/Button/Button'
import UserList from '../components/UserBlock/UserList'
import UserSearchField from '../components/UserBlock/UserSearchField'
import FriendRequests from '../components/UserBlock/FriendRequests'
import { useGetFriends } from '../hooks/user/useGetFriends'
import { useFriendRequests } from '../hooks/user/useFriendRequests'
import { useFriendActions } from '../hooks/user/useFriendActions'
import styles from '../style/Page/Friends.module.scss'
export default function Friends() {
  const [params, setParams] = useSearchParams()
  const search = params.get('username') || ''
  const requestsOnly = params.get('section') === 'requests'
  const requestsQuery = useFriendRequests()
  const { friendsList, isFetching, error } = useGetFriends()
  const { acceptFriend } = useFriendActions()
  const filtered = friendsList.filter((user) =>
    user.username.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  )
  const accept = (sender: string) => {
    if (acceptFriend(sender))
      requestsQuery.setRequests((users) => users.filter((user) => user._id !== sender))
  }
  const requests = (
    <FriendRequests
      requests={requestsQuery.requests}
      loading={requestsQuery.isLoading}
      error={requestsQuery.error}
      expanded={requestsOnly}
      onAccept={accept}
    />
  )
  if (requestsOnly) return requests
  return (
    <>
      {(requestsQuery.requests.length > 0 || requestsQuery.error) && requests}
      <div className={styles.friend__block}>
        <div className={styles.friend__header}>
          <h3>Все друзья: {filtered.length}</h3>
          <Link to="/search">
            <Button appearance="primary">Найти друзей</Button>
          </Link>
        </div>
        <UserSearchField
          value={search}
          onChange={(username) => setParams(username ? { username } : {}, { replace: true })}
          placeholder="Поиск друзей"
          className={styles.search__friends}
          clearClassName={styles.closeSearch}
        />
        <UserList
          users={filtered}
          loading={isFetching}
          error={error}
          errorMessage="Не удалось загрузить друзей."
          className={styles.friends__list}
          rowClassName={styles.friends__user}
          renderAction={(user) => (
            <Link to={'/?sel=' + user._id}>
              <Button appearance="primary">Написать сообщение</Button>
            </Link>
          )}
          empty={
            <h2 style={{ textAlign: 'center' }}>
              😔
              <br />
              {friendsList.length ? 'Не удалось найти друзей' : 'У вас нет друзей'}
              <br />
              <Link to="/search">
                <Button appearance="primary">Найти друзей</Button>
              </Link>
            </h2>
          }
        />
      </div>
    </>
  )
}
