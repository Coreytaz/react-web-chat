import type { AuthResponse } from '../types/User.interface'
import api from './api.service'
export const AuthService = {
  login: (EmailorLogin: string, password: string) =>
    api.post<AuthResponse>('auth/login', { EmailorLogin, password }),
  register: (email: string, password: string, login: string) =>
    api.post<AuthResponse>('auth/register', { email, password, login }),
  refresh: (signal?: AbortSignal) => api.get<AuthResponse>('auth/refresh', { signal }),
  logout: () => api.get<void>('auth/logout')
}
