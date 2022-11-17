import { AxiosError, AxiosResponse } from 'axios'
import { UseMutateAsyncFunction, useMutation } from 'react-query'
import { UserService } from '../../service/user/user.service'
import { ErrorResData } from '../../types/Error.interface'
import { ChangeAvatar } from '../../types/User.interface'
import { useAction } from '../useAction'

interface useAvatarType {
  avatarAsync: UseMutateAsyncFunction<AxiosResponse<ChangeAvatar> | null, AxiosError<unknown>, void, unknown>
}

export const useAvatar = (file: React.MutableRefObject<FormData | undefined>): useAvatarType => {
  const { setAvatar, setError, setSuccess } = useAction()

  const { mutateAsync: avatarAsync } = useMutation('avatar', async () => await UserService.avatar(file.current as FormData), {
    onError: (err: AxiosError) => {
      const { message, error } = err.response?.data as ErrorResData
      setError({ message, error })
    },
    onSuccess: ({ data }: any) => {
      setAvatar(data.avatar)
      setSuccess(data.message)
      file.current?.delete('avatar')
    }
  })

  return { avatarAsync }
}
