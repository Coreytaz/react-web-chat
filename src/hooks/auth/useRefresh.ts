import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import axios from 'axios'
import { AuthService } from '../../service/auth.service'
import { useAction } from '../useAction'
import { useTypedSelector } from '../useTypedSelector'
import { delСookie, setCookie } from '../../utils/cookie'
export const useRefresh = () => {
  const { isAuth, isClear } = useAction()
  const auth = useTypedSelector((s) => s.authSlice.auth)
  const query = useQuery({
    queryKey: ['session'],
    queryFn: async ({ signal }) => {
      try {
        return (await AuthService.refresh(signal)).data
      } catch (error) {
        if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status || 0))
          return null
        throw error
      }
    },
    staleTime: Infinity
  })
  useEffect(() => {
    if (query.data) {
      isAuth(query.data)
      setCookie('tokenIncd', 'true')
    } else if (query.data === null) {
      isClear()
      delСookie('tokenIncd')
    }
  }, [query.data, isAuth, isClear])
  return { ...query, isLoading: query.isPending || (!!query.data && !auth) }
}
