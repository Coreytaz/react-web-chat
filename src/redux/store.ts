import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import authSlice from './slice/authSlice'
import toastSlice from './slice/toastSlice'

export const store = configureStore({
  reducer: {
    authSlice,
    toastSlice
  }
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export type RootState = ReturnType<typeof store.getState>

export default store
