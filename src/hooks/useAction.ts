/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { authActions } from '../redux/slice/authSlice'
import { toastActions } from '../redux/slice/toastSlice'
import { userActions } from '../redux/slice/userSlice'

const allActions = {
  ...toastActions,
  ...authActions,
  ...userActions
}

export const useAction = () => {
  const dispatch = useDispatch()
  return bindActionCreators(allActions, dispatch)
}
