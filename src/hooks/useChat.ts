/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import socket from '../service/chat/socket.service'
import { getAllMessage, MessageUpdatePayload } from '../types/Chat.interface'
import { useAction } from './useAction'
import { useTypedSelector } from './useTypedSelector'

interface useChatProps {
  chatActions: {
    onClickSendMessage: (msg: string) => void
    onUpdateMessage: (payload: MessageUpdatePayload) => void
    onRemoveMes: (payload: string) => void
    onClickClearAllMessages: () => void
  }
}

export const useChat = (): useChatProps => {
  const { _id } = useTypedSelector((state) => state.authSlice.user)
  const { selectedUser, messages } = useTypedSelector((state) => state.selectedUserSlice)
  const [arriveMes, setArriveMes] = React.useState<getAllMessage>(null!)
  const { setMessages } = useAction()

  React.useEffect(() => {
    socket.on('MESG-RECIEVE', (data) => {
      if (selectedUser?._id === data.from) {
        setArriveMes({ id: data.id, fromSelf: false, message: data.message })
      }
    })
    return () => {
      socket.off('MESG-RECIEVE')
    }
  }, [_id, selectedUser?._id, setMessages])

  React.useEffect(() => {
    arriveMes && setMessages([...messages, arriveMes])
  }, [arriveMes])

  React.useEffect(() => {
    socket.on('message:update-RECIEVE', ({ updatedMessage }) => {
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
      const updatedMes = messages.filter((mes) => mes.id !== removedMessage._id)
      setMessages(updatedMes)
    })
    return () => {
      socket.off('message:delete-RECIEVE')
    }
  }, [messages, setMessages])

  React.useEffect(() => {
    socket.on('messages:clear-recieve', ({ clearAllmsg }) => {
      console.log(clearAllmsg)
    })
  }, [messages, setMessages])

  const onClickSendMessage = React.useCallback((msg: string) => {
    socket.emit('SEND-MESG', {
      to: selectedUser._id,
      from: _id,
      message: msg
    })
  }, [])

  const onUpdateMessage = React.useCallback((payload: MessageUpdatePayload) => {
    socket.emit('message:update', payload)
  }, [])

  const onRemoveMes = React.useCallback((payload: string) => {
    socket.emit('message:delete', payload)
  }, [])

  const onClickClearAllMessages = React.useCallback((): void => {
    socket.emit('messages:clear', {
      to: selectedUser._id,
      from: _id
    })
  }, [])

  const chatActions = React.useMemo(
    () => ({
      onClickSendMessage,
      onUpdateMessage,
      onRemoveMes,
      onClickClearAllMessages
    }),
    []
  )

  return { chatActions }
}
