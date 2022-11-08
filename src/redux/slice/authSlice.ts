import { createSlice } from '@reduxjs/toolkit'
import { IUserRedux } from '../../types/User.interface'

interface authSliceProps {
  auth: boolean
  user: IUserRedux
}

const initialState: authSliceProps = {
  auth: false,
  user: {
    _id: '',
    email: '',
    login: '',
    username: '',
    avatar: null
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    isAuth (state, actions) {
      state.auth = true
      state.user = actions.payload.user
    },
    setAvatar (state, actions) {
      if (state.user !== null) {
        state.user.avatar = actions.payload
      }
    },
    isClear (state) {
      state.auth = false
      state.user = {
        _id: '',
        email: '',
        login: '',
        username: '',
        avatar: null
      }
    },
    updateUser (state, actions) {
      if (state.user !== null) {
        state.user = { ...state.user, ...actions.payload }
      }
    }
  }
})

export const authActions = authSlice.actions

export default authSlice.reducer
