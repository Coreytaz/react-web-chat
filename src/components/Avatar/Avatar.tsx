import React from 'react'
import generateAvatarFromHash from '../../utils/generateAvatarFromHash'
import style from './Avatar.module.scss'

interface AvatarProps {
  _id: string
  avatar: string | null
  username: string
}

const Avatar: React.FC<AvatarProps> = ({ _id, avatar, username }) => {
  if (avatar != null) {
    return (
          <img
            className={style.avatar}
            src={avatar}
            alt={`Avatar ${username}`}
          />
    )
  } else {
    const { color, colorLighten } = generateAvatarFromHash(_id)
    const firstChar = username.split(' ').map((char) => char.charAt(0).toUpperCase()).slice(0, 2).join('')
    return (
          <div
            style={{
              background: `linear-gradient(135deg, ${color} 0%, ${colorLighten} 96.52%)`
            }}
            className={style.avatar + ' ' + style.avatar__symbol}
          >
            {firstChar}
          </div>
    )
  }
}

export default Avatar
