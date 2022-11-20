import { AxiosResponse } from 'axios'
import { getAllMessage } from '../../types/Chat.interface'
import api from '../api.service'

export const ChatService = {
  async getAllMessage (from: string, to: string, page?: number, limit?: number): Promise<AxiosResponse<getAllMessage[]>> {
    return await api.post('chat/getMessages', { from, to }, { params: { page, limit } })
  }
}
