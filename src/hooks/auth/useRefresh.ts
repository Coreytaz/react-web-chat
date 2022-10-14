import { AxiosResponse } from 'axios'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from 'react-query'
import { isAuth } from '../../redux/slice/authSlice'
import { useAppDispatch } from '../../redux/store'
import { AuthService } from '../../service/auth.service'

interface useRefreshType {
  asyncRefresh: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<AxiosResponse<any, any>, Error>>
  isLoading?: boolean
}

export const useRefresh = (): useRefreshType => {
  const dispatch = useAppDispatch()

  const { refetch: asyncRefresh, isLoading } = useQuery('refresh', async () => await AuthService.refresh(String(localStorage.getItem('token'))), {
    onSuccess: ({ data }) => {
      dispatch(isAuth(data))
    },
    onError: (err: Error) => alert(err),
    enabled: false
  })

  return { asyncRefresh, isLoading }
}
