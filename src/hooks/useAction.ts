/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { authActions } from '../redux/slice/authSlice'
import { onClickClearAllMessages, onClickSendMessage, onRemoveMes, onUpdateMessage, selectedUserActions } from '../redux/slice/selectedUserSlice'
import { onAcceptReguesFriend, onSendReguesFriend, toastActions } from '../redux/slice/toastSlice'
import { userActions } from '../redux/slice/userSlice'

const allActions = {
  ...toastActions,
  ...authActions,
  ...userActions,
  ...selectedUserActions,
  onClickSendMessage,
  onUpdateMessage,
  onRemoveMes,
  onClickClearAllMessages,
  onSendReguesFriend,
  onAcceptReguesFriend
}

export const useAction = () => {
  const dispatch = useDispatch()
  return bindActionCreators(allActions, dispatch)
}
