import { createSlice } from '@reduxjs/toolkit'
import { IUser } from '../../types/User.interface'

interface authSliceProps {
  auth: boolean
  user: IUser | null
  accessToken: string
}

const initialState: authSliceProps = {
  auth: false,
  user: null,
  accessToken: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    isAuth (state, actions) {
      state.auth = true
      state.user = actions.payload.user
      state.accessToken = actions.payload.accessToken
    },
    setAvatar (state, actions) {
      if (state.user !== null) {
        state.user.avatar = actions.payload
      }
    },
    isClear (state) {
      state.auth = false
      state.user = null
      state.accessToken = ''
    }
  }
})

export const { isAuth, isClear, setAvatar } = authSlice.actions

export default authSlice.reducer
