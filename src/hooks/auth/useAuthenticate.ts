import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AuthService } from '../../service/auth.service'
import { clearPrivateQueries } from '../../service/query'
import { setCookie } from '../../utils/cookie'
import { errorMessage } from '../../utils/errors'
import { useAction } from '../useAction'
export type AuthMode = 'login' | 'register'
export interface Credentials {
  email: string
  password: string
  login: string
}
export function useAuthenticate(mode: AuthMode, { email, password, login }: Credentials) {
  const { isAuth, setError, setSuccess } = useAction()
  const client = useQueryClient()
  return useMutation({
    mutationFn: () =>
      mode === 'login'
        ? AuthService.login(email, password)
        : AuthService.register(email, password, login),
    onError: (error) => setError(errorMessage(error)),
    onSuccess: async ({ data }) => {
      await clearPrivateQueries(client)
      client.setQueryData(['session'], data)
      setCookie('tokenIncd', 'true')
      isAuth(data)
      setSuccess(mode === 'login' ? 'Вы вошли в систему!' : 'Вы зарегистрировались!')
    }
  })
}
