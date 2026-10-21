import { useAccountMutation } from './useAccountMutation'
import type { RefObject } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { UserService } from '../../service/user/user.service'
import { useAction } from '../useAction'
import type { AuthResponse } from '../../types/User.interface'
export const useAvatar = (file: RefObject<FormData | undefined>) => {
  const { setAvatar, setSuccess } = useAction()
  const client = useQueryClient()
  const mutation = useAccountMutation({
    mutationFn: () => {
      if (!file.current) throw new Error('Выберите файл')
      return UserService.avatar(file.current)
    },
    onSuccess: ({ data }) => {
      setAvatar(data.avatar)
      client.setQueryData<AuthResponse>(['session'], (old) =>
        old ? { user: { ...old.user, avatar: data.avatar } } : old
      )
      setSuccess(data.message)
      file.current = undefined
    }
  })
  return { avatarAsync: () => mutation.mutate(), isPending: mutation.isPending }
}
