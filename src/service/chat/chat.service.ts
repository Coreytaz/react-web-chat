import { AxiosResponse } from 'axios'
import { getAllMessage } from '../../types/Chat.interface'
import api from '../api.service'

export const ChatService = {
  async getAllMessage (from: string, to: string, page?: number, limit?: number): Promise<AxiosResponse<getAllMessage[]>> {
    return await api.post('chat/getMessages', { from, to }, { params: { page, limit } })
  },
  async recordMessage (file: File): Promise<AxiosResponse<void>> {
    const formData = new FormData()
    formData.append('recordMessage', file)
    return await api.post('chat/recordMessage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
