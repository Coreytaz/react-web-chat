/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { ChatInput, Loading, UserBlock, UserBlockSkeleton } from '..'
import styles from './ChatContainer.module.scss'
import Point from '../../assets/point.svg'
import Robot from '../../assets/robot.gif'
import cn from 'classnames'
import { useSearchParams } from 'react-router-dom'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { getAllMessage } from '../../types/Chat.interface'
import { generateUUID } from '../../utils/generateUUID'
import socket from '../../service/chat/socket.service'
import { useGetUser } from '../../hooks/user/useGetUser'
import { useGetAllMessages } from '../../hooks/chat/useGetAllMessages'

const ChatContainer = (): JSX.Element => {
  const [arriveMes, setArriveMes] = React.useState<getAllMessage>(null!)
  const { _id, username } = useTypedSelector((state) => state.authSlice.user)
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('sel')
  const scrollRef = React.useRef<HTMLDivElement>(null!)
  const { asyncUser, isFetching, selectedUser } = useGetUser(userId!)
  const { asyncGetAllMessage, isLoading, messages, setMessages } = useGetAllMessages(_id, selectedUser?._id)

  React.useEffect(() => {
    socket.emit('ADD-USER', _id)
  }, [_id])

  React.useEffect(() => {
    socket.on('MESG-RECIEVE', (data) => {
      if (selectedUser?._id === data.from) {
        setArriveMes({ fromSelf: false, message: data.message })
      }
    })
    return () => {
      socket.off('MESG-RECIEVE')
    }
  }, [_id, selectedUser?._id])

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

  const onClickSendMessage = (msg: string): void => {
    socket.emit('SEND-MESG', {
      to: selectedUser._id,
      from: _id,
      message: msg
    })
    setMessages((prevState) => ([...prevState, { fromSelf: true, message: msg }]))
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
              {isFetching ? <UserBlockSkeleton/> : <UserBlock _id={selectedUser?._id} avatar={selectedUser?.avatar} username={selectedUser?.username} />}
              </div>
              <div className={styles.message_dropdown}>
                  <img src={Point} className={styles.dropBtn}/>
                     <div className={styles.message_dropdown_content}>
                       <a href="#">Link 1</a>
                       <a href="#">Link 2</a>
                       <a href="#">Link 3</a>
                </div>
              </div>
            </div>
            <div className={styles.message_inner}>
              {
                isLoading
                  ? <Loading/>
                  : (messages.length
                      ? messages.map((mes) =>
                    <div key={generateUUID()} ref={scrollRef} className={cn(styles.row, styles.no_gutters)}>
                        <div className={cn(styles.chat_bubble,
                          {
                            [styles.chat_bubble__left]: !mes.fromSelf,
                            [styles.chat_bubble__right]: mes.fromSelf
                          })}>{mes.message}</div>
                    </div>)
                      : <div className={styles.welcome}>
                <img src={Robot} alt="" />
              <h2>
              У вас нету сообщений с пользователем, <span>{selectedUser?.username}!</span>
              </h2>
              <h4>Чтобы начать разговор напишите снизу сообщение</h4>
                </div>)}
            </div>
          </div>
          <ChatInput onClickSendMessage={onClickSendMessage}/>
    </>
  )
}

export default ChatContainer
