import { AxiosError, AxiosResponse } from 'axios'
import { UseMutateAsyncFunction, useMutation } from 'react-query'
import { isAuth } from '../../redux/slice/authSlice'
import { setList } from '../../redux/slice/toastSlice'
import { useAppDispatch } from '../../redux/store'
import { AuthService } from '../../service/auth.service'

interface useLoginType {
  loginAsync: UseMutateAsyncFunction<AxiosResponse<any, any>, Error, void, unknown>
  isLoading?: boolean
}

// interface errorData {
//   error: string
//   message: string[]
//   statusCode: number
// }

export const useLogin = (email: string, password: string): useLoginType => {
  const dispatch = useAppDispatch()

  const { mutateAsync: loginAsync, isLoading } = useMutation('login', async () => await AuthService.login(email, password), {
    onError: (err: AxiosError) => {
      const res: any = err.response?.data
      if (Array.isArray(res.message)) {
        res.message.map((data: any) => dispatch(setList({
          id: Date.now(),
          title: res.error,
          description: data,
          backgroundColor: '#bd362f'
        })))
      } else {
        dispatch(setList({
          id: Date.now(),
          title: res.error,
          description: res.message,
          backgroundColor: '#bd362f'
        }))
      }
    },
    onSuccess: ({ data }) => {
      localStorage.setItem('token', data.accessToken)
      dispatch(isAuth(data))
      dispatch(setList({
        id: Date.now(),
        title: 'Success',
        description: 'Вы вошли в систему!',
        backgroundColor: '#5cb85c'
      }))
    }
  })

  return { loginAsync, isLoading }
}
