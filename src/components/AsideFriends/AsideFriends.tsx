import { FC, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserBlock, UserBlockSkeleton } from '..'
import { useGetFriends } from '../../hooks/user/useGetFriends'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import styles from '../../style/Page/Home.module.scss'

const AsideFriends: FC = () => {
  const { auth } = useTypedSelector((state) => state.authSlice)
  const { asyncFriendsUser, isFetching, friendsList } = useGetFriends()

  useEffect(() => {
    if (auth) {
      void asyncFriendsUser()
    }
  }, [auth, asyncFriendsUser])

  return (
    <aside className={styles.aside}>
          <ul>
          {(isFetching ?? false)
            ? [...new Array(9)].map((_, i) => <li key={i}>
              <UserBlockSkeleton/>
          </li>)
            : friendsList?.map((user) =>
            <Link to={`/?sel=${user._id}`} key={user._id}>
              <li>
              <UserBlock _id={user._id} avatar={user.avatar} username={user.username}/>
              </li>
            </Link>)}
          </ul>
    </aside>
  )
}

export default AsideFriends
