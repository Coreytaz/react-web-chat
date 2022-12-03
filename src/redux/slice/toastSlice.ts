import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { UserService } from '../../service/user/user.service'
import { generateUUID } from '../../utils/generateUUID'

interface toastSliceProps {
  toastlist: toastList[]
}

interface toastList {
  id: string
  title: string
  description: string
  backgroundColor: string
}

const initialState: toastSliceProps = {
  toastlist: []
}

export const onSendReguesFriend = createAsyncThunk<any, string>(
  'toast/send-ReguesFriend',
  async function (userId, { dispatch }) {
    try {
      const { data } = await UserService.getUser(userId)
      dispatch(toastActions.setSuccess(`Вам приглашение в друзья от :${data.username}`))
    } catch (error) {
      dispatch(toastActions.setError(error))
    }
  }
)

export const onAcceptReguesFriend = createAsyncThunk<any, string>(
  'toast/accept-ReguesFriend',
  async function (userId, { dispatch }) {
    try {
      const { data } = await UserService.getUser(userId)
      dispatch(toastActions.setSuccess(`Пользователь ${data.username} принял приглашение в друзья!`))
    } catch (error) {
      dispatch(toastActions.setError(error))
    }
  }
)

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    setList (state, actions) {
      state.toastlist = [...state.toastlist, actions.payload]
    },
    setSuccess (state, actions) {
      state.toastlist = [...state.toastlist, {
        id: generateUUID(),
        title: 'Success',
        description: actions.payload,
        backgroundColor: '#5cb85c'
      }]
    },
    setError (state, actions) {
      if (Array.isArray(actions.payload.message)) {
        state.toastlist = [...state.toastlist, ...actions.payload.message.map((message: string) => ({
          id: generateUUID(),
          title: actions.payload.error,
          description: message,
          backgroundColor: '#bd362f'
        }))]
      } else {
        state.toastlist = [...state.toastlist, {
          id: generateUUID(),
          title: actions.payload.error,
          description: actions.payload.message,
          backgroundColor: '#bd362f'
        }]
      }
    },
    deleteList (state, actions) {
      state.toastlist = state.toastlist.filter(e => e.id !== actions.payload)
    }
  }
})

export const toastActions = toastSlice.actions

export default toastSlice.reducer
