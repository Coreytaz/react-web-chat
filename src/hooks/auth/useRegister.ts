import { AxiosError, AxiosResponse } from 'axios'
import { UseMutateAsyncFunction, useMutation } from 'react-query'
import { AuthService } from '../../service/auth.service'
import { ErrorResData } from '../../types/Error.interface'
import { IUser } from '../../types/User.interface'
import { setCookie } from '../../utils/cookie'
import { useAction } from '../useAction'

interface useRegisterType {
  registerAsync: UseMutateAsyncFunction<AxiosResponse<IUser>, Error, void, unknown>
  isLoading: boolean
}

export const useRegister = (email: string, password: string, login: string): useRegisterType => {
  const { setError, isAuth, setSuccess } = useAction()

  const { mutateAsync: registerAsync, isLoading } = useMutation('register', async () => await AuthService.register(email, password, login), {
    onError: (err: AxiosError) => {
      const { message, error } = err.response?.data as ErrorResData
      setError({ message, error })
    },
    onSuccess: ({ data }) => {
      setCookie('tokenIncd', 'true')
      isAuth({ ...data })
      setSuccess('Вы зарегистрировались!')
    }
  })

  return { registerAsync, isLoading }
}
