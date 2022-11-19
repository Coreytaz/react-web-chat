/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { ChatInput, Loading, UserBlock, UserBlockSkeleton } from '..'
import styles from './ChatContainer.module.scss'
import Point from '../../assets/point.svg'
import Robot from '../../assets/robot.gif'
import { useSearchParams } from 'react-router-dom'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { getAllMessage, MessageUpdatePayload } from '../../types/Chat.interface'
import { generateUUID } from '../../utils/generateUUID'
import socket from '../../service/chat/socket.service'
import { useGetUser } from '../../hooks/user/useGetUser'
import { useGetAllMessages } from '../../hooks/chat/useGetAllMessages'
import { ReactComponent as Trash } from './Trash.svg'
import Message from './Message'

const ChatContainer = (): JSX.Element => {
  const [arriveMes, setArriveMes] = React.useState<getAllMessage>(null!)
  const { _id, username } = useTypedSelector((state) => state.authSlice.user)
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('sel')
  const scrollRef = React.useRef<HTMLDivElement>(null!)
  const { asyncUser, isFetching, selectedUser } = useGetUser(userId!)
  const { asyncGetAllMessage, isLoading, messages, setMessages } = useGetAllMessages(_id, selectedUser?._id)
  const [editingState, setEditingState] = React.useState(false)
  const [editingMessage, setEditingMessage] = React.useState<MessageUpdatePayload>(null!)

  React.useEffect(() => {
    socket.emit('ADD-USER', _id)
  }, [_id])

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
      setMessages((prevState) => ([...prevState, { id: data.id, fromSelf: true, message: data.message }]))
    })
    return () => {
      socket.off('MESG-RECIEVE')
      socket.off('MESG-YOU')
    }
  }, [_id, selectedUser?._id, setMessages])

  React.useEffect(() => {
    arriveMes && setMessages((prev) => [...prev, arriveMes])
  }, [arriveMes, setMessages])

  React.useEffect(() => {
    if (selectedUser) {
      void asyncGetAllMessage()
    }
  }, [asyncGetAllMessage, selectedUser])

  React.useEffect(() => {
    if (userId != null) {
      void asyncUser()
    }
  }, [userId, asyncUser])

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
    console.log(123)
    socket.emit('messages:clear', {
      to: selectedUser._id,
      from: _id
    })
  }

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
    <div>
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
            <div className={styles.message_inner}>
              {
                isLoading
                  ? <Loading/>
                  : (messages.length
                      ? messages.map((mes) => <Message key={generateUUID()} setEditingState={setEditingState} setEditingMessage={setEditingMessage} scrollRef={scrollRef} {...mes} />)
                      : <div className={styles.welcome}>
                <img src={Robot} alt="" />
              <h2>
              У вас нету сообщений с пользователем, <span>{selectedUser?.username}!</span>
              </h2>
              <h4>Чтобы начать разговор напишите снизу сообщение</h4>
                </div>)}
            </div>
          </div>
          <ChatInput onUpdateMessage={onUpdateMessage} editingMessage={editingMessage} editingState={editingState} onClickSendMessage={onClickSendMessage}/>
    </>
  )
}

export default ChatContainer
