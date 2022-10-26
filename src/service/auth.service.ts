/* eslint-disable no-useless-escape */
/* eslint-disable quote-props */
import axios, { AxiosResponse } from 'axios'

axios.defaults.baseURL = 'http://localhost:5000/api'
axios.defaults.headers.options = {
  'Content-Type': 'application/json'
}

const mail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

export const AuthService = {
  async login (emailOrLogin: string, password: string): Promise<AxiosResponse<any, any>> {
    const data = mail.test(emailOrLogin) ? { email: emailOrLogin } : { login: emailOrLogin }
    console.log(data)
    return await axios.post('auth/login', { ...data, password })
  },

  async register (email: string, password: string, login: string): Promise<AxiosResponse<any, any>> {
    return await axios.post('auth/register', { email, password, login })
  },

  async refresh (token: string): Promise<AxiosResponse<any, any>> {
    return await axios.get('auth/refresh', { headers: { 'Authorization': `Bearer ${token}` } })
  },

  async logout (): Promise<AxiosResponse<any, any>> {
    return await axios.get('auth/logout')
  }
}
