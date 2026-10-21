import { Navigate } from 'react-router-dom'
import AuthForm from '../components/Form/AuthForm'
import { useTypedSelector } from '../hooks/useTypedSelector'
export default function Auth() {
  const authenticated = useTypedSelector((state) => state.authSlice.auth)
  return authenticated ? <Navigate to="/" replace /> : <AuthForm mode="register" />
}
