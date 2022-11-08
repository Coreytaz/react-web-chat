export interface SendMessage {
  _id: string
  users: string[]
  sender: string[]
  message: string
}

export interface getAllMessage {
  fromSelf: boolean
  message: string
}
