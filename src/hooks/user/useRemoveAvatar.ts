import { AxiosError, AxiosResponse } from 'axios'
import { UseMutateAsyncFunction, useMutation } from 'react-query'
import { UserService } from '../../service/user/user.service'
import { ErrorResData } from '../../types/Error.interface'
import { ChangeAvatar } from '../../types/User.interface'
import { useAction } from '../useAction'

interface useRemoveAvatarType {
  removeAvatar: UseMutateAsyncFunction<AxiosResponse<ChangeAvatar> | null, AxiosError<unknown>, void, unknown>
}

export const useRemoveAvatar = (): useRemoveAvatarType => {
  const { setAvatar, setError, setSuccess } = useAction()

  const { mutateAsync: removeAvatar } = useMutation('removeAvatar', async () => await UserService.removeAvatar(), {
    onError: (err: AxiosError) => {
      const { message, error } = err.response?.data as ErrorResData
      setError({ message, error })
    },
    onSuccess: ({ data }) => {
      setAvatar(data.avatar)
      setSuccess(data.message)
    }
  })

  return { removeAvatar }
}
