import { isAuthResponse } from '../types/User.interface'
import api from './api.service'
import type { AxiosResponse } from 'axios'

async function sessionResponse(request: Promise<AxiosResponse<unknown>>) {
  const response = await request
  if (!isAuthResponse(response.data)) throw new Error('Сервер вернул некорректные данные сессии')
  return { ...response, data: response.data }
}
export const AuthService = {
  login: (EmailorLogin: string, password: string) =>
    sessionResponse(api.post('auth/login', { EmailorLogin, password })),
  register: (email: string, password: string, login: string) =>
    sessionResponse(api.post('auth/register', { email, password, login })),
  refresh: (signal?: AbortSignal) => sessionResponse(api.get('auth/refresh', { signal })),
  logout: () => api.get<void>('auth/logout')
}
