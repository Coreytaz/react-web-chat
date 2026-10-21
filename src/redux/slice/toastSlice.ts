import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
export interface ToastItem {
  id: string
  title: string
  description: string
  backgroundColor: string
}
export interface ToastError {
  message: string | string[]
  error: string
}
const toastSlice = createSlice({
  name: 'toast',
  initialState: { toastlist: [] as ToastItem[] },
  reducers: {
    setSuccess(state, action: PayloadAction<string>) {
      state.toastlist.push({
        id: nanoid(),
        title: 'Успешно',
        description: action.payload,
        backgroundColor: '#5cb85c'
      })
    },
    setError(state, action: PayloadAction<ToastError>) {
      for (const description of [action.payload.message].flat())
        state.toastlist.push({
          id: nanoid(),
          title: action.payload.error,
          description,
          backgroundColor: '#bd362f'
        })
    },
    deleteList(state, action: PayloadAction<string>) {
      state.toastlist = state.toastlist.filter((t) => t.id !== action.payload)
    },
    clearToasts(state) {
      state.toastlist = []
    }
  }
})
export const toastActions = toastSlice.actions
export default toastSlice.reducer
