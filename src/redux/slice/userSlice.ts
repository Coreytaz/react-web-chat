import { createSlice } from '@reduxjs/toolkit'

interface userSliceProps {
  userOnline: String[]
}

const initialState: userSliceProps = {
  userOnline: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setOnline (state, actions) {
      state.userOnline = actions.payload
    }
  }
})

export const userActions = userSlice.actions

export default userSlice.reducer
