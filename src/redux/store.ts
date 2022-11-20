import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slice/authSlice'
import selectedUserSlice from './slice/selectedUserSlice'
import toastSlice from './slice/toastSlice'
import userSlice from './slice/userSlice'

export const store = configureStore({
  reducer: {
    authSlice,
    toastSlice,
    userSlice,
    selectedUserSlice
  }
})

export type TypeRootState = ReturnType<typeof store.getState>

export default store
