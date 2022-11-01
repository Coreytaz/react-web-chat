import { AxiosResponse } from 'axios'
import api from '../api.service'

export const UserService = {
  async avatar (file: FormData): Promise<AxiosResponse<any, any> | null> {
    return await api.post('user/avatar', file)
  },

  async removeAvatar (): Promise<AxiosResponse<any, any>> {
    return await api.delete('user/avatar')
  },

  async updateUser (user: any): Promise<AxiosResponse<any, any> | null> {
    return await api.patch('user/me', user)
  }
}
