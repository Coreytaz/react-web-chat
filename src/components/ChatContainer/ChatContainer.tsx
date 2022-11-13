/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { ChatInput, Loading, UserBlock } from '..'
import styles from './ChatContainer.module.scss'
import Point from '../../assets/point.svg'
import Robot from '../../assets/robot.gif'
import cn from 'classnames'
import { useSearchParams } from 'react-router-dom'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { useMutation, useQuery } from 'react-query'
import { UserService } from '../../service/user/user.service'
import { getUser } from '../../types/User.interface'
import { AxiosError } from 'axios'
import { ChatService } from '../../service/chat/chat.service'
import { getAllMessage } from '../../types/Chat.interface'
import { generateUUID } from '../../utils/generateUUID'
import socket from '../../service/chat/socket.service'

const ChatContainer = (): JSX.Element => {
  const [messages, setMessages] = React.useState<getAllMessage[]>([])
  const [arriveMes, setArriveMes] = React.useState<getAllMessage>(null!)
  const [selectedUser, setSelectedUser] = React.useState<getUser>(null!)
  const { _id, username } = useTypedSelector((state) => state.authSlice.user)
  const [searchParams] = useSearchParams()
  const postQuery = searchParams.get('sel')
  const scrollRef = React.useRef<HTMLDivElement>(null!)

  React.useEffect(() => {
    socket.emit('ADD-USER', _id)
  }, [_id, selectedUser])

  React.useEffect(() => {
    socket.on('MESG-RECIEVE', (msg) => {
      setArriveMes({ fromSelf: false, message: msg })
    })
  }, [])

  React.useEffect(() => {
    arriveMes && setMessages((prev) => [...prev, arriveMes])
  }, [arriveMes])

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const { refetch: asyncUser, isFetching } = useQuery('getUser', async () => await UserService.getUser(postQuery), {
    onSuccess: ({ data }) => {
      setSelectedUser(data)
    },
    onError: (err) => {
      console.log(err)
    },
    enabled: false
  })

  const { mutateAsync: asyncGetAllMessage, isLoading } = useMutation('getAllMessages', async () => await ChatService.getAllMessage(_id, selectedUser._id), {
    onError: (err: AxiosError) => {
      console.log(err)
    },
    onSuccess: ({ data }) => {
      setMessages(data)
    }
  })

  React.useEffect(() => {
    if (selectedUser) {
      void asyncGetAllMessage()
    }
  }, [asyncGetAllMessage, selectedUser])

  React.useEffect(() => {
    if (postQuery != null) {
      void asyncUser()
    }
  }, [postQuery, asyncUser])

  const onClickSendMessage = (msg: string): void => {
    socket.emit('SEND-MESG', {
      to: selectedUser._id,
      from: _id,
      message: msg
    })
    setMessages((prevState) => ([...prevState, { fromSelf: true, message: msg }]))
  }

  if (postQuery === null) {
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
              <UserBlock isLoading={isFetching} avatar={selectedUser?.avatar} username={selectedUser?.username} />
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
