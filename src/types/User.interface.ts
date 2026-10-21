export interface SessionUser {
  _id: string
  email: string
  login: string
  username: string
  avatar: string | null
}
export interface AuthResponse {
  user: SessionUser
}
export interface ChangeAvatar {
  message: string
  avatar: string | null
}
export interface PublicUser {
  _id: string
  username: string
  avatar: string | null
}
export interface UserSearchResult {
  items: (PublicUser & { friends?: boolean })[]
  total: number
}
