import { createSlice } from '@reduxjs/toolkit'

interface authSliceProps {
  auth: boolean
}

const initialState: authSliceProps = {
  auth: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    isAuth (state) {
      state.auth = true
    }
  }
})

export const { isAuth } = authSlice.actions

export default authSlice.reducer
