import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthResponse, SessionUser } from '../../types/User.interface'
import { isAuthResponse } from '../../types/User.interface'
const emptyUser: SessionUser = { _id: '', email: '', login: '', username: '', avatar: null }
const initialState = { auth: false, user: emptyUser }
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    isAuth(state, action: PayloadAction<AuthResponse>) {
      if (!isAuthResponse(action.payload)) return initialState
      state.auth = true
      state.user = action.payload.user
    },
    setAvatar(state, action: PayloadAction<string | null>) {
      state.user.avatar = action.payload
    },
    isClear() {
      return initialState
    },
    updateUser(state, action: PayloadAction<Partial<SessionUser>>) {
      Object.assign(state.user, action.payload)
    }
  }
})
export const authActions = authSlice.actions
export default authSlice.reducer
