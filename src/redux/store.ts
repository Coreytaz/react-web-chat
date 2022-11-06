import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slice/authSlice'
import toastSlice from './slice/toastSlice'

export const store = configureStore({
  reducer: {
    authSlice,
    toastSlice
  }
})

export type TypeRootState = ReturnType<typeof store.getState>

export default store
