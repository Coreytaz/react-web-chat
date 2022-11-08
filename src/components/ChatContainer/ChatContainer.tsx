/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { Button, Input, UserBlock } from '..'
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

const ChatContainer = (): JSX.Element => {
  const [input, setInput] = React.useState('')
  const [messages, setMessages] = React.useState<getAllMessage[]>([])
  const [selectedUser, setSelectedUser] = React.useState<getUser>(null!)
  const { _id, username } = useTypedSelector((state) => state.authSlice.user)
  const [searchParams] = useSearchParams()
  const postQuery = searchParams.get('sel')

  const { refetch: asyncUser, isFetching } = useQuery('getUser', async () => await UserService.getUser(postQuery), {
    onSuccess: ({ data }) => {
      setSelectedUser(data)
    },
    onError: (err) => {
      console.log(err)
    },
    enabled: false
  })

  const { mutateAsync: asyncGetAllMessage } = useMutation('getAllMessages', async () => await ChatService.getAllMessage(_id, selectedUser._id), {
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

  const { mutateAsync: asyncSendMessage, isLoading } = useMutation('SendMessage', async () => await ChatService.sendMessage(input, _id, selectedUser._id), {
    onError: (err: AxiosError) => {
      console.log(err)
    },
    onSuccess: ({ data }) => {
      console.log(data)
    }
  })

  React.useEffect(() => {
    if (postQuery != null) {
      void asyncUser()
    }
  }, [postQuery, asyncUser])

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

  const onClickSendMessage = (): void => {
    void asyncSendMessage()
    setInput('')
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
                    messages.map((mes) =>
                    <div key={generateUUID()} className={cn(styles.row, styles.no_gutters)}>
                        <div className={cn(styles.chat_bubble,
                          {
                            [styles.chat_bubble__left]: !mes.fromSelf,
                            [styles.chat_bubble__right]: mes.fromSelf
                          })}>{mes.message}</div>
                    </div>)
                }
            </div>
          </div>
          <div className={styles.messges_input}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              name="message"
              placeholder="Напишите сообщение..."
              required
            />
            <Button appearance="primary" disabled={isLoading} onClick={() => onClickSendMessage()}>Отправить</Button>
          </div>
    </>
  )
}

export default ChatContainer
