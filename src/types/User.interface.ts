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
export function isAuthResponse(value: unknown): value is AuthResponse {
  if (!value || typeof value !== 'object' || !('user' in value)) return false
  const user = value.user
  return (
    !!user &&
    typeof user === 'object' &&
    '_id' in user &&
    typeof user._id === 'string' &&
    user._id.length > 0 &&
    'email' in user &&
    typeof user.email === 'string' &&
    'login' in user &&
    typeof user.login === 'string' &&
    'username' in user &&
    typeof user.username === 'string' &&
    'avatar' in user &&
    (user.avatar === null || typeof user.avatar === 'string')
  )
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
