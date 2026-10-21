import { memo } from 'react'
import Avatar from '../Avatar/Avatar'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import type { PublicUser } from '../../types/User.interface'
import styles from './UserBlock.module.scss'
function UserBlock(user: PublicUser) {
  const online = useTypedSelector((state) => state.userSlice.userOnline.includes(user._id))
  const avatar = <Avatar {...user} />
  return (
    <>
      {online ? <span className={styles.root}>{avatar}</span> : avatar}
      <p className={styles.username}>{user.username}</p>
    </>
  )
}
export default memo(UserBlock)
