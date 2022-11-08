/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { UserBlockSkeleton } from '..'
import Avatar from '../../assets/defaultAvatar.jpg'
import styles from './UserBlock.module.scss'

interface UserBlockProps {
  avatar: string | null
  username: string
  isLoading?: boolean
}

const UserBlock: React.FC<UserBlockProps> = ({ avatar, username, isLoading }) => {
  if (isLoading) {
    return (
      <>
      <UserBlockSkeleton/>
      </>
    )
  }

  return (
    <>
    <img className={styles.img} src={avatar !== null ? avatar : Avatar} alt="avatar" />
    <p>{username}</p>
    </>
  )
}

export default UserBlock
