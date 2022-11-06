import { AxiosError, AxiosResponse } from 'axios'
import { UseMutateAsyncFunction, useMutation } from 'react-query'
import { apiSetHeader } from '../../service/api.service'
import { AuthService } from '../../service/auth.service'
import { ErrorResData } from '../../types/Error.interface'
import { IUser } from '../../types/User.interface'
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
      localStorage.setItem('token', data.accessToken)
      apiSetHeader('Authorization', `Bearer ${data.accessToken}`)
      isAuth(data)
      setSuccess('Вы вошли в систему!')
    }
  })

  return { loginAsync, isLoading }
}
