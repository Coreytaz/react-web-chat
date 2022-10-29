import { AxiosError, AxiosResponse } from 'axios'
import { UseMutateAsyncFunction, useMutation } from 'react-query'
import { isAuth } from '../../redux/slice/authSlice'
import { setList } from '../../redux/slice/toastSlice'
import { useAppDispatch } from '../../redux/store'
import { AuthService } from '../../service/auth.service'

interface useRegisterType {
  registerAsync: UseMutateAsyncFunction<AxiosResponse<any, any>, Error, void, unknown>
  isLoading: boolean
}

export const useRegister = (email: string, password: string, login: string): useRegisterType => {
  const dispatch = useAppDispatch()

  const { mutateAsync: registerAsync, isLoading } = useMutation('register', async () => await AuthService.register(email, password, login), {
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
      dispatch(isAuth({ ...data }))
      dispatch(setList({
        id: Date.now(),
        title: 'Success',
        description: 'Вы зарегистрировались!',
        backgroundColor: '#5cb85c'
      }))
    }
  })

  return { registerAsync, isLoading }
}
