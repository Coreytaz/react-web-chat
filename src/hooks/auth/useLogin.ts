import { AxiosError, AxiosResponse } from 'axios'
import { UseMutateAsyncFunction, useMutation } from 'react-query'
import { AuthService } from '../../service/auth.service'
import { ErrorResData } from '../../types/Error.interface'
import { IUser } from '../../types/User.interface'
import { setCookie } from '../../utils/cookie'
import { useAction } from '../useAction'

interface useLoginType {
  loginAsync: UseMutateAsyncFunction<AxiosResponse<IUser>, Error, void, unknown>
  isLoading?: boolean
}

export const useLogin = (emailOrLogin: string, password: string): useLoginType => {
  const { isAuth, setError, setSuccess } = useAction()

  const { mutateAsync: loginAsync, isLoading } = useMutation('login', async () => await AuthService.login(emailOrLogin, password), {
    onError: (err: AxiosError) => {
      const { message, error } = err.response?.data as ErrorResData
      setError({ message, error })
    },
    onSuccess: ({ data }) => {
      setCookie('tokenIncd', 'true')
      isAuth(data)
      setSuccess('Вы вошли в систему!')
    }
  })

  return { loginAsync, isLoading }
}
