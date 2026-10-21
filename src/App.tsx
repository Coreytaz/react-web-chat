import { lazy, Suspense } from 'react'
import { useSessionExpiry } from './hooks/auth/useSessionExpiry'
import { Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import PrivateRoutes from './utils/PrivateRoutes'
import Loading from './components/Loading/Loading'
import { useRefresh } from './hooks/auth/useRefresh'
import { useChat } from './hooks/useChat'
const Home = lazy(() => import('./pages/Home'))
const Auth = lazy(() => import('./pages/Auth'))
const Friends = lazy(() => import('./pages/Friends'))
const Search = lazy(() => import('./pages/Search'))
const Profile = lazy(() => import('./pages/Profile'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const session = useRefresh()
  useChat()
  useSessionExpiry()
  if (session.isLoading)
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  if (session.isError)
    return (
      <Layout>
        <p role="alert">Не удалось проверить сессию. Проверьте подключение.</p>
        <button onClick={() => void session.refetch()}>Повторить</button>
      </Layout>
    )
  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/search" element={<Search />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
