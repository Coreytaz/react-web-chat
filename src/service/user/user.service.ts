import { AxiosResponse } from 'axios'
import { ChangeAvatar, getSearchUser, getUser, IUser } from '../../types/User.interface'
import api from '../api.service'

export const UserService = {
  async avatar (file: FormData): Promise<AxiosResponse<ChangeAvatar> | null> {
    return await api.post('user/avatar', file)
  },

  async removeAvatar (): Promise<AxiosResponse<ChangeAvatar>> {
    return await api.delete('user/avatar')
  },

  async updateUser (user: { email: string, username: string }): Promise<AxiosResponse<IUser> | null> {
    return await api.patch('user/me', user)
  },

  async getListUser (username?: string, email?: string): Promise<AxiosResponse<getSearchUser>> {
    return await api.get('user/search', { params: { username, email } })
  },

  async getUser (_id: string | null): Promise<AxiosResponse<getUser>> {
    return await api.get('user/getUser', { params: { _id } })
  }
}
