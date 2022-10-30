import { createSlice } from '@reduxjs/toolkit'

interface toastSliceProps {
  toastlist: toastList[]
}

interface toastList {
  id: number
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
    deleteList (state, actions) {
      return {
        toastlist: actions.payload
      }
    }
  }
})

export const { setList, deleteList } = toastSlice.actions

export default toastSlice.reducer
