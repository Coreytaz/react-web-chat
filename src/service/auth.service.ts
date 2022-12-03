import { AxiosResponse } from 'axios'
import { IUser } from '../types/User.interface'
import api from './api.service'

export const AuthService = {
  async login (EmailorLogin: string, password: string): Promise<AxiosResponse<IUser>> {
    return await api.post('auth/login', { EmailorLogin, password })
  },

  async register (email: string, password: string, login: string): Promise<AxiosResponse<IUser>> {
    return await api.post('auth/register', { email, password, login })
  },

  async refresh (): Promise<AxiosResponse<IUser>> {
    return await api.get('auth/refresh')
  },

  async logout (): Promise<AxiosResponse<void>> {
    return await api.get('auth/logout')
  }
}
