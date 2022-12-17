/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { Avatar } from '..'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import styles from './UserBlock.module.scss'

interface UserBlockProps {
  _id: string
  avatar: string | null
  username: string
}

const UserBlock: React.FC<UserBlockProps> = ({ _id, avatar, username }) => {
  const { userOnline } = useTypedSelector((state) => state.userSlice)
  return (
    <>
    {userOnline.includes(_id)
      ? <span className={styles.root}>
        <Avatar _id={_id} avatar={avatar} username={username}/>
    </span>
      : <Avatar _id={_id} avatar={avatar} username={username}/>}
        <p className={styles.username}>{username}</p>
    </>
  )
}

export default UserBlock
