/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { authActions } from '../redux/slice/authSlice'
import { toastActions } from '../redux/slice/toastSlice'

const allActions = {
  ...toastActions,
  ...authActions
}

export const useAction = () => {
  const dispatch = useDispatch()
  return bindActionCreators(allActions, dispatch)
}
