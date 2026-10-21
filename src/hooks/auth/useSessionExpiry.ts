import { useEffect } from 'react'
import { isAxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { clearPrivateQueries } from '../../service/query'
import api from '../../service/api.service'
import socket from '../../service/chat/socket.service'
import { delСookie } from '../../utils/cookie'
import { useAction } from '../useAction'
export function useSessionExpiry() {
  const client = useQueryClient()
  const { isClear, setOnline } = useAction()
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (r) => r,
      async (error: unknown) => {
        if (
          isAxiosError(error) &&
          error.response?.status === 401 &&
          !error.config?.url?.startsWith('auth/')
        ) {
          socket.disconnect()
          isClear()
          setOnline([])
          delСookie('tokenIncd')
          await clearPrivateQueries(client)
          client.setQueryData(['session'], null)
        }
        return Promise.reject(error)
      }
    )
    return () => api.interceptors.response.eject(interceptor)
  }, [client, isClear, setOnline])
}
