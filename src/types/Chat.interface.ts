export interface SendMessage {
  _id: string
  users: string[]
  sender: string[]
  message: string
}

export interface getAllMessage {
  id: string
  fromSelf: boolean
  message: string
  createdAt: Date
  updatedAt: Date
}

export interface MessageUpdatePayload {
  id: string
  message: string
}
