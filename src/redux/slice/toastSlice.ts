import { createSlice } from '@reduxjs/toolkit'
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
      console.log(actions.payload)
      if (Array.isArray(actions.payload.message)) {
        state.toastlist = [...state.toastlist, actions.payload.message.map((message: string) => ({
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
