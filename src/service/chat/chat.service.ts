import { AxiosResponse } from 'axios'
import { getAllMessage } from '../../types/Chat.interface'
import api from '../api.service'

export const ChatService = {
  async getAllMessage (from: string, to: string): Promise<AxiosResponse<getAllMessage[]>> {
    return await api.post('chat/getMessages', { from, to })
  }
}
