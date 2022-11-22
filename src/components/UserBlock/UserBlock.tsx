/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import Avatar from '../../assets/defaultAvatar.jpg'
import { useAction } from '../../hooks/useAction'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import socket from '../../service/chat/socket.service'
import styles from './UserBlock.module.scss'

interface UserBlockProps {
  online?: boolean
  _id: string
  avatar: string | null
  username: string
}

const UserBlock: React.FC<UserBlockProps> = ({ _id, avatar, username }) => {
  const { setOnline } = useAction()
  const { userOnline } = useTypedSelector((state) => state.userSlice)

  React.useEffect(() => {
    socket.on('ADD-USER-STATUS', (data: String[]) => {
      setUser(data)
    })
  }, [])

  const setUser = React.useCallback((data: String[]): void => {
    setOnline(data)
  }, [])

  return (
    <>
    {userOnline.includes(_id)
      ? <span className={styles.root}>
    <img className={styles.img} src={avatar !== null ? avatar : Avatar} alt="avatar" />
    </span>
      : <img className={styles.img} src={avatar !== null ? avatar : Avatar} alt="avatar" />}
    <p>{username}</p>
    </>
  )
}

export default UserBlock
