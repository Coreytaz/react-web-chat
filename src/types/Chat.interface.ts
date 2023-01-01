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
  voiceMessage?: string
  attachments?: attachment[]
}

export interface attachment {
  id: string
  url: string
  status: string
  name: string
}

export interface MessageUpdatePayload {
  id: string
  message: string
}
