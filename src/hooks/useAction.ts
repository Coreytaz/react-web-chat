import { useMemo } from 'react'
import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../redux/store'
import { authActions } from '../redux/slice/authSlice'
import { toastActions } from '../redux/slice/toastSlice'
import { userActions } from '../redux/slice/userSlice'
const actions = { ...authActions, ...toastActions, ...userActions }
export const useAction = () => {
  const dispatch = useDispatch<AppDispatch>()
  return useMemo(() => bindActionCreators(actions, dispatch), [dispatch])
}
