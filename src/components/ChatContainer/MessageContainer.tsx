/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import styles from './ChatContainer.module.scss'
import { Loading } from '..'
import { getAllMessage, MessageUpdatePayload } from '../../types/Chat.interface'
import { generateUUID } from '../../utils/generateUUID'
import Message from './Message'
import Robot from '../../assets/robot.gif'
import { UseMutateAsyncFunction } from 'react-query'
import { AxiosError, AxiosResponse } from 'axios'
import useOnScreen from '../../hooks/useScroll'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import AudioMessage from './AudioMessage'

interface MessageContainerProps {
  isLoading: boolean | undefined
  setEditingState: React.Dispatch<React.SetStateAction<boolean>>
  setEditingMessage: React.Dispatch<React.SetStateAction<MessageUpdatePayload>>
  asyncGetAllMessage: UseMutateAsyncFunction<AxiosResponse<getAllMessage[], any>, AxiosError<unknown, any>, void, unknown>
  editingState: boolean
}

const MessageContainer: React.FC<MessageContainerProps> = ({ asyncGetAllMessage, isLoading, setEditingState, setEditingMessage, editingState }) => {
  const { selectedUser, messages, lazyMessage } = useTypedSelector((state) => state.selectedUserSlice)
  const childRef = React.useRef<HTMLDivElement>(null!)
  const isOnScreen = useOnScreen(childRef)
  const scrollRef = React.useRef<HTMLDivElement>(null!)
  const isMounted = React.useRef(true)

  React.useEffect(() => {
    if (isOnScreen && messages.length > 29 && lazyMessage.length > 0) {
      isMounted.current = false
      void asyncGetAllMessage()
    }
  }, [isOnScreen])

  if (isLoading) {
    <Loading/>
  }

  React.useEffect(() => {
    if (isMounted.current) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [lazyMessage, messages])

  return (
    <div className={styles.message_inner}>
              <div ref={childRef} style={{ height: 1 }}/>
              {
              (messages.length > 0)
                ? (<>
                      {messages.map((mes) =>
                      <Message
                      key={generateUUID()}
                      setEditingState={setEditingState}
                      setEditingMessage={setEditingMessage}
                      scrollRef={scrollRef}
                      editingState={editingState}
                      {...mes} />
                      )}
                      <AudioMessage/>
                      </>)
                : !isLoading
                    ? <div className={styles.welcome}>
                <img src={Robot} alt="" />
              <h2>
              У вас нету сообщений с пользователем, <span>{selectedUser?.username}!</span>
              </h2>
              <h4>Чтобы начать разговор напишите снизу сообщение</h4>
                </div>
                    : null}
            </div>
  )
}

export default MessageContainer
