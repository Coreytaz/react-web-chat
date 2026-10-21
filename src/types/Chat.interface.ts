export interface Attachment {
  id: string
  url: string
  status: 'uploading' | 'done' | 'error'
  name: string
}
export interface ChatMessage {
  id: string
  fromSelf: boolean
  message: string | null
  createdAt: string
  updatedAt: string
  voiceMessage?: string | null
  attachments?: Attachment[]
}
export interface MessageUpdatePayload {
  id: string
  message: string
  attachments?: Attachment[]
}
export interface SendMessage {
  to: string
  from: string
  message: string | null
  attachments: Attachment[]
  voiceMessage?: string
}
export interface SocketMessage extends ChatMessage {
  from: string
  to: string
}
export interface StoredMessage {
  _id: string
  message: string | null
  updatedAt: string
  attachments?: Attachment[]
}
export interface FriendRequest {
  sender: string
  taker: string
  accept?: number
}
export interface ServerEvents {
  'operation:error': (error: { code: string; message: string }) => void
  connect: () => void
  'MESG-RECIEVE': (data: SocketMessage) => void
  'MESG-YOU': (data: SocketMessage) => void
  'ADD-USER-STATUS': (data: string[]) => void
  'message:update-RECIEVE': (data: { updatedMessage: StoredMessage | null }) => void
  'message:delete-RECIEVE': (data: { removedMessage: StoredMessage | null }) => void
  'messages:clear-recieve': () => void
  'reguest:user-recieve': (data: { request: FriendRequest }) => void
  'accept:user-recieve': (data: { request: FriendRequest }) => void
}
export interface ClientEvents {
  'ADD-USER': (id: string) => void
  'SEND-MESG': (data: SendMessage) => void
  'message:update': (data: MessageUpdatePayload) => void
  'message:delete': (id: string) => void
  'messages:clear': (data: { from: string; to: string }) => void
  'reguest:user': (data: FriendRequest) => void
  'accept:user': (data: FriendRequest) => void
}
