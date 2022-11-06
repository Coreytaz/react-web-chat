import React from 'react'
import Avatar from '../../assets/defaultAvatar.jpg'
import styles from './UserBlock.module.scss'

interface UserBlockProps {
  avatar: string | null
  username: string
}

const UserBlock: React.FC<UserBlockProps> = ({ avatar, username }) => {
  return (
    <>
    <img className={styles.img} src={avatar !== null ? avatar : Avatar} alt="avatar" />
    <p>{username}</p>
    </>
  )
}

export default UserBlock
