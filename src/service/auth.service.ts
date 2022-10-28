import { AxiosResponse } from 'axios'
import { IUser } from '../types/User.interface'
import api from './api.service'

const mail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

export const AuthService = {
  async login (emailOrLogin: string, password: string): Promise<AxiosResponse<IUser, any>> {
    const _emailOrLogin = mail.test(emailOrLogin) ? { email: emailOrLogin } : { login: emailOrLogin }
    return await api.post('auth/login', { ..._emailOrLogin, password })
  },

  async register (email: string, password: string, login: string): Promise<AxiosResponse<IUser, any>> {
    return await api.post('auth/register', { email, password, login })
  },

  async refresh (): Promise<AxiosResponse<IUser, any>> {
    return await api.get('auth/refresh')
  },

  async logout (): Promise<AxiosResponse<void, any>> {
    return await api.get('auth/logout')
  }
}
