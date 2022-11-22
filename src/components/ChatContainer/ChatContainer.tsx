/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { ChatInput, Loading } from '..'
import Robot from '../../assets/robot.gif'
import styles from './ChatContainer.module.scss'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { MessageUpdatePayload } from '../../types/Chat.interface'
import socket from '../../service/chat/socket.service'
import { useGetAllMessages } from '../../hooks/chat/useGetAllMessages'
import MessageContainer from './MessageContainer'
import { useAction } from '../../hooks/useAction'
import MessageHeader from './MessageHeader'
import { useGetUser } from '../../hooks/user/useGetUser'
import { useChat } from '../../hooks/useChat'

const ChatContainer = (): JSX.Element => {
  const { asyncUser, isFetching, userId } = useGetUser()
  const { setMessages } = useAction()
  const [page, setPage] = React.useState(0)
  const { _id, username } = useTypedSelector((state) => state.authSlice.user)
  const { selectedUser } = useTypedSelector((state) => state.selectedUserSlice)
  const { asyncGetAllMessage, isLoading } = useGetAllMessages(_id, selectedUser._id, page, setPage)
  const [editingState, setEditingState] = React.useState(false)
  const [editingMessage, setEditingMessage] = React.useState<MessageUpdatePayload>(null!)
  useChat()

  React.useEffect(() => {
    socket.emit('ADD-USER', _id)
  }, [_id])

  React.useEffect(() => {
    if (userId !== null && userId !== selectedUser._id) {
      setPage(0)
      setMessages([])
      void asyncUser()
    }
  }, [userId])

  React.useEffect(() => {
    if (selectedUser._id) {
      void asyncGetAllMessage()
    }
    return () => {
      setMessages([])
    }
  }, [selectedUser._id])

  if (userId === null) {
    return (
        <div className={styles.welcome}>
        <img src={Robot} alt="" />
      <h2>
      Добро пожаловать, <span>{username}!</span>
      </h2>
      <h4>Пожалуйста, выберите чат, чтобы начать разговор.</h4>
        </div>
    )
  }

  if (isFetching) {
    return (
    <Loading/>
    )
  }

  return (
  <>
    <div className={styles.mesage_wrapper}>
      <MessageHeader/>
      <MessageContainer
        isLoading={isLoading}
        setEditingState={setEditingState}
        setEditingMessage={setEditingMessage}
        asyncGetAllMessage={asyncGetAllMessage}
      />
    </div>
    <ChatInput
      setEditingState={setEditingState}
      editingMessage={editingMessage}
      editingState={editingState}
      />
  </>
  )
}

export default ChatContainer
