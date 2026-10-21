import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
const userSlice = createSlice({
  name: 'user',
  initialState: { userOnline: [] as string[] },
  reducers: {
    setOnline(state, action: PayloadAction<string[]>) {
      state.userOnline = action.payload
    }
  }
})
export const userActions = userSlice.actions
export default userSlice.reducer
