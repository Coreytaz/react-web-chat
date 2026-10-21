import { useAccountMutation } from './useAccountMutation'
import { useQueryClient } from '@tanstack/react-query'
import { UserService } from '../../service/user/user.service'
import { useAction } from '../useAction'
import type { AuthResponse } from '../../types/User.interface'
export const useRemoveAvatar = () => {
  const { setAvatar } = useAction()
  const client = useQueryClient()
  const mutation = useAccountMutation({
    mutationFn: UserService.removeAvatar,
    onSuccess: () => {
      setAvatar(null)
      client.setQueryData<AuthResponse>(['session'], (old) =>
        old ? { user: { ...old.user, avatar: null } } : old
      )
    }
  })
  return { removeAvatar: () => mutation.mutate(), isPending: mutation.isPending }
}
