import socket from '../../service/chat/socket.service'
import { useTypedSelector } from '../useTypedSelector'
import { useAction } from '../useAction'
export function useFriendActions() {
  const id = useTypedSelector((state) => state.authSlice.user._id)
  const { setError } = useAction()
  const connected = () => {
    if (socket.connected) return true
    setError({ error: 'Ошибка', message: 'Нет соединения с чатом' })
    return false
  }
  const requestFriend = (taker: string) => {
    if (!connected()) return false
    socket.emit('reguest:user', { sender: id, taker })
    return true
  }
  const acceptFriend = (sender: string) => {
    if (!connected()) return false
    socket.emit('accept:user', { sender, taker: id, accept: 1 })
    return true
  }
  return { requestFriend, acceptFriend }
}
