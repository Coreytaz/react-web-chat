/* eslint-disable quote-props */
import axios, { AxiosResponse } from 'axios'

axios.defaults.baseURL = 'http://localhost:5000/api'
axios.defaults.headers.options = {
  'Content-Type': 'application/json'
}

export const AuthService = {
  async login (email: string, password: string): Promise<AxiosResponse<any, any>> {
    return await axios.post('auth/login', { email, password })
  },

  async register (email: string, password: string): Promise<AxiosResponse<any, any>> {
    return await axios.post('auth/register', { email, password })
  },

  async refresh (token: string): Promise<AxiosResponse<any, any>> {
    return await axios.get('auth/refresh', { headers: { 'Authorization': `Bearer ${token}` } })
  }
}
