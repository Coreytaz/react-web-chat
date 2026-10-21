import { lazy, Suspense } from 'react'
import Loading from '../components/Loading/Loading'
import { useLocation, Navigate } from 'react-router-dom'
import AuthForm from '../components/Form/AuthForm'
import { useTypedSelector } from '../hooks/useTypedSelector'
const ChatWorkspace = lazy(() => import('../components/ChatContainer/ChatWorkspace'))

export default function Home() {
  const authenticated = useTypedSelector((state) => state.authSlice.auth)
  const location = useLocation()
  const state = location.state as { from?: { pathname?: string; search?: string } } | null
  const from = state?.from
  const target =
    from?.pathname?.startsWith('/') && !from.pathname.startsWith('//')
      ? from.pathname + (from.search || '')
      : null
  if (!authenticated) return <AuthForm mode="login" />
  if (target && target !== '/') return <Navigate to={target} replace />
  return (
    <Suspense fallback={<Loading />}>
      <ChatWorkspace />
    </Suspense>
  )
}
