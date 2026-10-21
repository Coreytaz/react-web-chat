import { io, type Socket } from 'socket.io-client'
import type { ServerEvents, ClientEvents } from '../../types/Chat.interface'
const socket: Socket<ServerEvents, ClientEvents> = io(
  import.meta.env.VITE_SOCKET_URL || undefined,
  { autoConnect: false, withCredentials: true }
)
export default socket
