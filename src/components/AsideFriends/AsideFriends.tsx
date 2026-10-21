import { Link } from 'react-router-dom'
import UserBlock from '../UserBlock/UserBlock'
import UserBlockSkeleton from '../UserBlock/UserBlockSkeleton'
import { useGetFriends } from '../../hooks/user/useGetFriends'
import styles from '../../style/Page/Home.module.scss'
export default function AsideFriends() {
  const { friendsList, isFetching, error } = useGetFriends()
  return (
    <aside className={styles.aside}>
      {error ? <p role="alert">Не удалось загрузить друзей.</p> : null}
      <ul>
        {isFetching
          ? Array.from({ length: 9 }, (_, i) => (
              <li key={i}>
                <UserBlockSkeleton />
              </li>
            ))
          : friendsList.map((user) => (
              <li key={user._id}>
                <Link to={'/?sel=' + user._id}>
                  <UserBlock {...user} />
                </Link>
              </li>
            ))}
      </ul>
    </aside>
  )
}
