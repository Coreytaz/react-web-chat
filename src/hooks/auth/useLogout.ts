import { AxiosError, AxiosResponse } from 'axios'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from 'react-query'
import { AuthService } from '../../service/auth.service'
import { ErrorResData } from '../../types/Error.interface'
import { delСookie } from '../../utils/cookie'
import { useAction } from '../useAction'

interface useRefreshType {
  asyncLogout: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<AxiosResponse<void>, Error>>
  isLoading?: boolean
}

export const useLogout = (): useRefreshType => {
  const { setError, setSuccess, isClear } = useAction()

  const { refetch: asyncLogout, isLoading } = useQuery('logout', async () => await AuthService.logout(), {
    onSuccess: () => {
      delСookie('tokenIncd')
      isClear()
      setSuccess('Вы вышли из сессии!')
    },
    onError: (err: AxiosError) => {
      const { message, error } = err.response?.data as ErrorResData
      setError({ message, error })
    },
    enabled: false
  })

  return { asyncLogout, isLoading }
}
