import React from 'react'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { Routes, Route } from 'react-router-dom'
import './style/index.scss'
import Layout from './layout/Layout'
import Auth from './pages/Auth'
import { useRefresh } from './hooks/auth/useRefresh'
import Profile from './pages/Profile'

function App (): JSX.Element {
  const { asyncRefresh } = useRefresh()

  React.useLayoutEffect(() => {
    if (localStorage.getItem('token') != null) {
      void asyncRefresh()
    }
  }, [asyncRefresh])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App
