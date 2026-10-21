import { memo } from 'react'
import cn from 'classnames'
import type { PublicUser } from '../../types/User.interface'
import generateAvatarFromHash from '../../utils/generateAvatarFromHash'
import styles from './Avatar.module.scss'
function Avatar({ _id, avatar, username }: PublicUser) {
  if (avatar) return <img className={styles.avatar} src={avatar} alt={'Avatar ' + username} />
  const { color, colorLighten } = generateAvatarFromHash(_id)
  const initials = username
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, ' + color + ' 0%, ' + colorLighten + ' 96.52%)'
      }}
      className={cn(styles.avatar, styles.avatar__symbol)}
    >
      {initials}
    </div>
  )
}
export default memo(Avatar)
