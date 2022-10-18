import { AxiosError, AxiosResponse } from 'axios'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from 'react-query'
import { isAuth } from '../../redux/slice/authSlice'
import { setList } from '../../redux/slice/toastSlice'
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
    onError: (err: AxiosError) => {
      const res: any = err.response?.data
      if (Array.isArray(res.message)) {
        res.message.map((data: any) => dispatch(setList({
          id: Date.now(),
          title: res.error,
          description: data,
          backgroundColor: '#bd362f'
        })))
      } else {
        dispatch(setList({
          id: Date.now(),
          title: res.error,
          description: res.message,
          backgroundColor: '#bd362f'
        }))
      }
    },
    enabled: false
  })

  return { asyncRefresh, isLoading }
}
