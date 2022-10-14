import { AxiosResponse } from 'axios'
import { UseMutateAsyncFunction, useMutation } from 'react-query'
import { isAuth } from '../../redux/slice/authSlice'
import { setList } from '../../redux/slice/toastSlice'
import { useAppDispatch } from '../../redux/store'
import { AuthService } from '../../service/auth.service'

interface useLoginType {
  loginAsync: UseMutateAsyncFunction<AxiosResponse<any, any>, Error, void, unknown>
  isLoading?: boolean
}

export const useLogin = (email: string, password: string): useLoginType => {
  const dispatch = useAppDispatch()

  const { mutateAsync: loginAsync, isLoading } = useMutation('login', async () => await AuthService.login(email, password), {
    onError: (err: Error) => alert(err),
    onSuccess: ({ data }) => {
      localStorage.setItem('token', data.accessToken)
      dispatch(isAuth(data))
      dispatch(setList({
        id: Date.now(),
        title: 'Success',
        description: 'This is a success toast component',
        backgroundColor: '#5cb85c'
      }))
    }
  })

  return { loginAsync, isLoading }
}
