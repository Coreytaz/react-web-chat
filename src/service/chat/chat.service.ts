import { AxiosResponse } from 'axios'
import { getAllMessage, SendMessage } from '../../types/Chat.interface'
import api from '../api.service'

export const ChatService = {
  async sendMessage (message: string, from: string, to: string): Promise<AxiosResponse<SendMessage>> {
    console.log(message, from, to)
    return await api.post('chat/addMessage', { message, from, to })
  },
  async getAllMessage (from: string, to: string): Promise<AxiosResponse<getAllMessage[]>> {
    return await api.post('chat/getMessages', { from, to })
  }
}
