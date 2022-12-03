export interface IUser {
  _id: string
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
    _id: string
    avatar: string | null
    username: string
    friends?: boolean
  }>
  total: number
}

export interface getUser {
  _id: string
  username: string
  avatar: string | null
}
