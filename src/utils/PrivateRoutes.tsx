import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'
import { RootState } from '../redux/store'

const PrivateRoutes = (): JSX.Element => {
  const { auth } = useSelector((state: RootState) => state.authSlice)
  return (
    auth ? <Outlet/> : <Navigate to='/'/>
  )
}

export default PrivateRoutes
