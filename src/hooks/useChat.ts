/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import socket from '../service/chat/socket.service'
import { getAllMessage } from '../types/Chat.interface'
import { useAction } from './useAction'
import { useTypedSelector } from './useTypedSelector'

export const useChat = (): void => {
  const { _id } = useTypedSelector((state) => state.authSlice.user)
  const { selectedUser, messages } = useTypedSelector((state) => state.selectedUserSlice)
  const [arriveMes, setArriveMes] = React.useState<getAllMessage>(null!)
  const { setMessages } = useAction()

  React.useEffect(() => {
    socket.on('MESG-RECIEVE', (data) => {
      if (selectedUser?._id === data.from) {
        setArriveMes({ fromSelf: false, ...data })
      }
    })
    return () => {
      socket.off('MESG-RECIEVE')
    }
  }, [_id, selectedUser?._id, setMessages])

  React.useEffect(() => {
    socket.on('MESG-YOU', (data) => {
      setMessages([...messages, { fromSelf: true, ...data }])
    })
    return () => {
      socket.off('MESG-YOU')
    }
  }, [messages, setMessages])

  React.useEffect(() => {
    arriveMes && setMessages([...messages, arriveMes])
  }, [arriveMes])

  React.useEffect(() => {
    socket.on('message:update-RECIEVE', ({ updatedMessage }) => {
      const updatedMes = messages.map((mes) => {
        if (mes.id === updatedMessage._id) {
          return { ...mes, message: updatedMessage.message, updatedAt: updatedMessage.updatedAt, attachments: updatedMessage.attachments }
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
      setMessages(messages.filter((mes) => mes.id !== removedMessage._id))
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
}
