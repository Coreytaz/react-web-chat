import { AxiosError, AxiosResponse } from 'axios'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from 'react-query'
import { apiSetHeader } from '../../service/api.service'
import { AuthService } from '../../service/auth.service'
import { ErrorResData } from '../../types/Error.interface'
import { IUser } from '../../types/User.interface'
import { useAction } from '../useAction'

interface useRefreshType {
  asyncRefresh: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<AxiosResponse<IUser>, Error>>
  isLoading?: boolean
}

export const useRefresh = (): useRefreshType => {
  const { setError, isAuth } = useAction()

  const { refetch: asyncRefresh, isLoading } = useQuery('refresh', async () => await AuthService.refresh(), {
    onSuccess: ({ data }) => {
      localStorage.setItem('token', data.accessToken)
      apiSetHeader('Authorization', `Bearer ${data.accessToken}`)
      isAuth(data)
    },
    onError: (err: AxiosError) => {
      const { message, error } = err.response?.data as ErrorResData
      setError({ message, error })
    },
    enabled: false
  })

  return { asyncRefresh, isLoading }
}
