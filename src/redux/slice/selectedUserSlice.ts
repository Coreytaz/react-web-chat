import { createSlice } from '@reduxjs/toolkit'
import { getAllMessage } from '../../types/Chat.interface'
import { getUser } from '../../types/User.interface'

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

export const selectedUserSlice = createSlice({
  name: 'selectedUser',
  initialState,
  reducers: {
    selectUser (state, actions) {
      state.selectedUser = actions.payload
    },
    setMessages (state, actions) {
      state.messages = actions.payload
    },
    setLazyMessages (state, actions) {
      state.lazyMessage = actions.payload
    }
  }
})

export const selectedUserActions = selectedUserSlice.actions

export default selectedUserSlice.reducer
