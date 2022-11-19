/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import styles from './ChatContainer.module.scss'
import cn from 'classnames'
import { ReactComponent as Pencel } from './Pencel.svg'
import { ReactComponent as Trash } from './Trash.svg'
import { MessageUpdatePayload } from '../../types/Chat.interface'
import socket from '../../service/chat/socket.service'

interface MessageProps {
  id: string
  scrollRef: React.MutableRefObject<HTMLDivElement>
  fromSelf: boolean
  message: string
  setEditingState: React.Dispatch<React.SetStateAction<boolean>>
  setEditingMessage: React.Dispatch<React.SetStateAction<MessageUpdatePayload>>
}

const Message = ({ id, scrollRef, fromSelf, message, setEditingState, setEditingMessage }: MessageProps): JSX.Element => {
  const onRemoveMes = React.useCallback((payload: string) => {
    socket.emit('message:delete', payload)
  }, [])
  return (
    <div ref={scrollRef} className={cn(styles.row, styles.no_gutters)}>
        {fromSelf && <Pencel onClick={() => {
          setEditingState(true)
          setEditingMessage({ id, message })
        }} />}
        {fromSelf && <Trash onClick={() => onRemoveMes(id)} />}
        <div className={cn(styles.chat_bubble,
          {
            [styles.chat_bubble__left]: !fromSelf,
            [styles.chat_bubble__right]: fromSelf
          })}>{message}</div>
    </div>
  )
}

export default Message
