import { clearPrivateQueries } from '../../service/query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AuthService } from '../../service/auth.service'
import socket from '../../service/chat/socket.service'
import { useAction } from '../useAction'
import { delСookie } from '../../utils/cookie'
import { errorMessage } from '../../utils/errors'
export const useLogout = () => {
  const { isClear, setOnline, clearToasts, setSuccess, setError } = useAction()
  const client = useQueryClient()
  const mutation = useMutation({
    mutationFn: () => AuthService.logout(),
    onError: (error) => setError(errorMessage(error)),
    onSuccess: async () => {
      socket.disconnect()
      await clearPrivateQueries(client)
      client.setQueryData(['session'], null)
      delСookie('tokenIncd')
      isClear()
      setOnline([])
      clearToasts()
      setSuccess('Вы вышли из сессии!')
    }
  })
  return { asyncLogout: () => mutation.mutate(), isLoading: mutation.isPending }
}
