import React from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useTypedSelector } from '../hooks/useTypedSelector'

const PrivateRoutes = (): JSX.Element => {
  const { auth } = useTypedSelector((state) => state.authSlice)
  const location = useLocation()
  return (
    auth ? <Outlet/> : <Navigate to='/' state={{ from: location }} replace/>
  )
}

export default PrivateRoutes
