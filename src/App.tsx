/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useEffect } from 'react'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { Routes, Route } from 'react-router-dom'
import './style/index.scss'
import Layout from './layout/Layout'
import Auth from './pages/Auth'
import { useRefresh } from './hooks/auth/useRefresh'
import Profile from './pages/Profile'
import { Loading } from './components'
import PrivateRoutes from './utils/PrivateRoutes'
import { getCookie } from './utils/cookie'
import Friends from './pages/Friends'
import Search from './pages/Search'

function App (): JSX.Element {
  const { asyncRefresh, isLoading } = useRefresh()

  useEffect(() => {
    if (getCookie('tokenIncd')) {
      void asyncRefresh()
    }
  }, [asyncRefresh])

  return (
    <Layout>{
      isLoading
        ? <Loading/>
        : <Routes>
        <Route element={<PrivateRoutes/>}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/search" element={<Search />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/*" element={<NotFound />} />
        </Routes>
      }
    </Layout>
  )
}

export default App
