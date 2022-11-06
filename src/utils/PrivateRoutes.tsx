import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useTypedSelector } from '../hooks/useTypedSelector'

const PrivateRoutes = (): JSX.Element => {
  const { auth } = useTypedSelector((state) => state.authSlice)
  return (
    auth ? <Outlet/> : <Navigate to='/'/>
  )
}

export default PrivateRoutes
