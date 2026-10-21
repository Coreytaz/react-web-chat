import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import socket from '../service/chat/socket.service'
import { keys } from '../service/query'
import { createMessageEventHandlers } from '../service/chat/message-events'
import type { FriendRequest } from '../types/Chat.interface'
import { useTypedSelector } from './useTypedSelector'
import { useAction } from './useAction'
export const useChat = () => {
  const id = useTypedSelector((s) => s.authSlice.user._id)
  const auth = useTypedSelector((s) => s.authSlice.auth)
  const client = useQueryClient()
  const { setOnline, setSuccess, setError } = useAction()
  useEffect(() => {
    if (!auth || !id) return
    const connect = () => {
      socket.emit('ADD-USER', id)
      void client.invalidateQueries({ queryKey: ['messages', id] })
      void client.invalidateQueries({ queryKey: keys.friends(id) })
      void client.invalidateQueries({ queryKey: keys.requests(id) })
    }
    const online = (users: string[]) => setOnline(users)
    const operationError = (error: { code: string; message: string }) => {
      setError({ error: 'Ошибка', message: error.message })
    }
    const connectionError = (error: Error) => {
      setError({ error: 'Ошибка соединения с чатом', message: error.message })
    }
    const { receive, update, remove } = createMessageEventHandlers(client, id)
    const clear = () => {
      void client.invalidateQueries({ queryKey: ['messages', id] })
    }
    const request = (_data: { request: FriendRequest }) => {
      void client.invalidateQueries({ queryKey: keys.requests(id) })
      setSuccess('Вам пришло приглашение в друзья')
    }
    const accept = (_data: { request: FriendRequest }) => {
      void client.invalidateQueries({ queryKey: keys.friends(id) })
      void client.invalidateQueries({ queryKey: keys.requests(id) })
      void client.invalidateQueries({ queryKey: ['search', id] })
      setSuccess('Приглашение в друзья принято')
    }
    socket.on('connect', connect)
    socket.on('connect_error', connectionError)
    socket.on('operation:error', operationError)
    socket.on('ADD-USER-STATUS', online)
    socket.on('MESG-RECIEVE', receive)
    socket.on('MESG-YOU', receive)
    socket.on('message:update-RECIEVE', update)
    socket.on('message:delete-RECIEVE', remove)
    socket.on('messages:clear-recieve', clear)
    socket.on('reguest:user-recieve', request)
    socket.on('accept:user-recieve', accept)
    socket.connect()
    return () => {
      socket.off('connect', connect)
      socket.off('connect_error', connectionError)
      socket.off('operation:error', operationError)
      socket.off('ADD-USER-STATUS', online)
      socket.off('MESG-RECIEVE', receive)
      socket.off('MESG-YOU', receive)
      socket.off('message:update-RECIEVE', update)
      socket.off('message:delete-RECIEVE', remove)
      socket.off('messages:clear-recieve', clear)
      socket.off('reguest:user-recieve', request)
      socket.off('accept:user-recieve', accept)
      socket.disconnect()
    }
  }, [auth, id, client, setOnline, setSuccess, setError])
}
