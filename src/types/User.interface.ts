export interface IUser {
  id: string
  email: string
  login: string
  username: string
  avatar: string | null
  accessToken: string
}

export interface IUserRedux extends Omit<IUser,
'accessToken'
> {

}

export interface ChangeAvatar {
  message: string
  avatar: string
}

export interface getSearchUser {
  items: Array<{
    avatar: string | null
    email: string
    username: string
  }>
  total: number
}
