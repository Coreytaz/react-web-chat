import { useAccountMutation } from './useAccountMutation'
import { useQueryClient } from '@tanstack/react-query'
import { UserService } from '../../service/user/user.service'
import { useAction } from '../useAction'
import type { AuthResponse } from '../../types/User.interface'
export const useUpdateUser = (email: string, username: string) => {
  const { updateUser, setSuccess } = useAction()
  const client = useQueryClient()
  const mutation = useAccountMutation({
    mutationFn: () => UserService.updateUser({ email, username }),
    onSuccess: () => {
      updateUser({ email, username })
      client.setQueryData<AuthResponse>(['session'], (old) =>
        old ? { user: { ...old.user, email, username } } : old
      )
      setSuccess('Данные изменены')
    }
  })
  return { userAsync: () => mutation.mutate(), isPending: mutation.isPending }
}
