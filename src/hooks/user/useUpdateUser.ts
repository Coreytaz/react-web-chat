import { AxiosError, AxiosResponse } from 'axios'
import { UseMutateAsyncFunction, useMutation } from 'react-query'
import { UserService } from '../../service/user/user.service'
import { ErrorResData } from '../../types/Error.interface'
import { IUser } from '../../types/User.interface'
import { useAction } from '../useAction'

interface useUpdateUserType {
  userAsync: UseMutateAsyncFunction<AxiosResponse<IUser> | null, AxiosError<unknown>, void, unknown>
}

export const useUpdateUser = (email: string, username: string): useUpdateUserType => {
  const { updateUser, setError, setSuccess } = useAction()

  const { mutateAsync: userAsync } = useMutation('updateUser', async () => await UserService.updateUser({ email, username }), {
    onError: (err: AxiosError) => {
      const { message, error } = err.response?.data as ErrorResData
      setError({ message, error })
    },
    onSuccess: () => {
      updateUser({ email, username })
      setSuccess('Данные изменены')
    }
  })

  return { userAsync }
}
