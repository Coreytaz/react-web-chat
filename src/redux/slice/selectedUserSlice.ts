/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/return-await */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import socket from '../../service/chat/socket.service'
import { attachment, getAllMessage, MessageUpdatePayload } from '../../types/Chat.interface'
import { getUser } from '../../types/User.interface'
import { authSliceProps } from './authSlice'

interface selectedUserSliceProps {
  selectedUser: getUser
  messages: getAllMessage[]
  lazyMessage: getAllMessage[]
}

const initialState: selectedUserSliceProps = {
  selectedUser: {
    _id: '',
    username: '',
    avatar: null
  },
  messages: [],
  lazyMessage: []
}

export const onClickSendMessage = createAsyncThunk<any, { msg: string, attachments: attachment[] }, { state: { selectedUserSlice: selectedUserSliceProps, authSlice: authSliceProps } }>(
  'selectedUser/send-message',
  async function (item, { getState }) {
    const selectedUser = getState().selectedUserSlice.selectedUser
    const _id = getState().authSlice.user._id
    socket.emit('SEND-MESG', {
      to: selectedUser?._id,
      from: _id,
      message: item.msg,
      attachments: item.attachments
    })
  }
)

export const onClickSendRecordMessage = createAsyncThunk<any, string, { state: { selectedUserSlice: selectedUserSliceProps, authSlice: authSliceProps } }>(
  'selectedUser/send-recordMessage',
  async function (msg, { getState }) {
    const selectedUser = getState().selectedUserSlice.selectedUser
    const _id = getState().authSlice.user._id
    socket.emit('SEND-MESG', {
      to: selectedUser?._id,
      from: _id,
      message: null,
      voiceMessage: msg,
      attachment: []
    })
  }
)

export const onUpdateMessage = createAsyncThunk<any, MessageUpdatePayload>(
  'selectedUser/update-message',
  async function (payload) {
    socket.emit('message:update', payload)
  }
)

export const onRemoveMes = createAsyncThunk<any, string>(
  'selectedUser/remove-message',
  async function (payload) {
    socket.emit('message:delete', payload)
  }
)

export const onClickClearAllMessages = createAsyncThunk<any, undefined, { state: { selectedUserSlice: selectedUserSliceProps, authSlice: authSliceProps } }>(
  'selectedUser/remove-message',
  async function (_, { getState }) {
    const selectedUser = getState().selectedUserSlice.selectedUser
    const _id = getState().authSlice.user._id
    socket.emit('messages:clear', {
      to: selectedUser._id,
      from: _id
    })
  }
)

export const selectedUserSlice = createSlice({
  name: 'selectUser',
  initialState,
  reducers: {
    selectUser (state, actions) {
      state.selectedUser = actions.payload
    },
    setMessages (state, actions) {
      state.messages = actions.payload
    },
    updateMessages (state, actions) {
      state.messages = state.messages.map((mes) => {
        if (mes.id === actions.payload.id) {
          return { ...mes, message: actions.payload.message }
        }
        return mes
      })
    },
    setLazyMessages (state, actions) {
      state.lazyMessage = actions.payload
    }
  }
})

export const selectedUserActions = selectedUserSlice.actions

export default selectedUserSlice.reducer
