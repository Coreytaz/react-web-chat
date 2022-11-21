/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { ChatInput, Loading, UserBlock, UserBlockSkeleton } from '..'
import styles from './ChatContainer.module.scss'
import Point from '../../assets/point.svg'
import Robot from '../../assets/robot.gif'

import { useTypedSelector } from '../../hooks/useTypedSelector'
import { getAllMessage, MessageUpdatePayload } from '../../types/Chat.interface'
import socket from '../../service/chat/socket.service'
import { useGetUser } from '../../hooks/user/useGetUser'
import { useGetAllMessages } from '../../hooks/chat/useGetAllMessages'
import { ReactComponent as Trash } from './Trash.svg'
import MessageContainer from './MessageContainer'
import { useAction } from '../../hooks/useAction'

const ChatContainer = (): JSX.Element => {
  const { asyncUser, isFetching, userId } = useGetUser()
  const { setMessages } = useAction()
  const [page, setPage] = React.useState(1)
  const [arriveMes, setArriveMes] = React.useState<getAllMessage>(null!)
  const { _id, username } = useTypedSelector((state) => state.authSlice.user)
  const { selectedUser, messages } = useTypedSelector((state) => state.selectedUserSlice)
  const { asyncGetAllMessage, isLoading } = useGetAllMessages(_id, selectedUser._id, page, setPage)
  const [editingState, setEditingState] = React.useState(false)
  const [editingMessage, setEditingMessage] = React.useState<MessageUpdatePayload>(null!)

  React.useEffect(() => {
    socket.emit('ADD-USER', _id)
  }, [_id])

  React.useEffect(() => {
    if (userId != null) {
      void asyncUser()
      setPage(0)
      setMessages([])
    }
  }, [userId, asyncUser])

  React.useEffect(() => {
    if (selectedUser._id) {
      setMessages([])
      setPage(0)
      void asyncGetAllMessage()
    }
  }, [userId, selectedUser])

  React.useEffect(() => {
    socket.on('messages:clear-recieve', () => {
      void asyncGetAllMessage()
    })
  }, [asyncGetAllMessage])

  React.useEffect(() => {
    socket.on('MESG-RECIEVE', (data) => {
      if (selectedUser?._id === data.from) {
        setArriveMes({ id: data.id, fromSelf: false, message: data.message })
      }
    })
    socket.on('MESG-YOU', (data) => {
      setMessages([...messages, { id: data.id, fromSelf: true, message: data.message }])
    })
    return () => {
      socket.off('MESG-RECIEVE')
      socket.off('MESG-YOU')
    }
  }, [_id, selectedUser?._id, setMessages])

  React.useEffect(() => {
    arriveMes && setMessages([...messages, arriveMes])
  }, [arriveMes])

  const onUpdateMessage = React.useCallback((payload: MessageUpdatePayload) => {
    const updatedMes = messages.map((mes) => {
      if (mes.id === payload.id) {
        return { ...mes, message: payload.message }
      }
      return mes
    })
    setMessages(updatedMes)
    socket.emit('message:update', payload)
    setEditingState(false)
  }, [messages, setMessages])

  React.useEffect(() => {
    socket.on('message:update-RECIEVE', ({ updatedMessage }) => {
      console.log(updatedMessage)
      const updatedMes = messages.map((mes) => {
        if (mes.id === updatedMessage._id) {
          return { ...mes, message: updatedMessage.message }
        }
        return mes
      })
      setMessages(updatedMes)
    })
    return () => {
      socket.off('message:update-RECIEVE')
    }
  }, [messages, setMessages])

  React.useEffect(() => {
    socket.on('message:delete-RECIEVE', ({ removedMessage }) => {
      console.log(removedMessage)
      const updatedMes = messages.filter((mes) => mes.id !== removedMessage._id)
      setMessages(updatedMes)
    })
    return () => {
      socket.off('message:delete-RECIEVE')
    }
  }, [messages, setMessages])

  const onClickSendMessage = (msg: string): void => {
    socket.emit('SEND-MESG', {
      to: selectedUser._id,
      from: _id,
      message: msg
    })
  }

  const onClickClearAllMessages = (): void => {
    socket.emit('messages:clear', {
      to: selectedUser._id,
      from: _id
    })
  }

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
        <div className={styles.mesage_header}>
              <div className={styles.message_user}>
              {isFetching ? <UserBlockSkeleton/> : <UserBlock {...selectedUser} />}
              </div>
              <div className={styles.message_dropdown}>
                  <img src={Point} className={styles.dropBtn}/>
                     <div className={styles.message_dropdown_content}>
                       <span onClick={() => onClickClearAllMessages()}>Удалить все сообщения <Trash/></span>
                       <span>Link 2</span>
                       <span>Link 3</span>
                </div>
              </div>
            </div>
            <MessageContainer
            isLoading={isLoading}
            setEditingState={setEditingState}
            setEditingMessage={setEditingMessage}
            asyncGetAllMessage={asyncGetAllMessage}
            />
          </div>
          <ChatInput onUpdateMessage={onUpdateMessage} setEditingState={setEditingState} editingMessage={editingMessage} editingState={editingState} onClickSendMessage={onClickSendMessage}/>
    </>
  )
}

export default ChatContainer
