import type {
  ChangeAvatar,
  UserSearchResult,
  PublicUser,
  AuthResponse
} from '../../types/User.interface'
import api from '../api.service'
export const UserService = {
  avatar: (file: FormData) => api.postForm<ChangeAvatar>('user/avatar', file),
  removeAvatar: () => api.delete<ChangeAvatar>('user/avatar'),
  updateUser: (user: { email: string; username: string }) =>
    api.patch<AuthResponse>('user/me', user),
  getListUser: (username = '', signal?: AbortSignal) =>
    api.get<UserSearchResult>('user/search', { params: { username }, signal }),
  getUser: (_id: string, signal?: AbortSignal) =>
    api.get<PublicUser>('user/getUser', { params: { _id }, signal }),
  getReguestUser: (signal?: AbortSignal) =>
    api.get<PublicUser[]>('user/getReguestUser', { signal }),
  getFriends: (signal?: AbortSignal) => api.get<PublicUser[]>('user/getFriends', { signal })
}
