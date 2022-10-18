import { AxiosError, AxiosResponse } from 'axios'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from 'react-query'
import { isClear } from '../../redux/slice/authSlice'
import { setList } from '../../redux/slice/toastSlice'
import { useAppDispatch } from '../../redux/store'
import { AuthService } from '../../service/auth.service'

interface useRefreshType {
  asyncLogout: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<AxiosResponse<any, any>, Error>>
  isLoading?: boolean
}

export const useLogout = (): useRefreshType => {
  const dispatch = useAppDispatch()

  const { refetch: asyncLogout, isLoading } = useQuery('logout', async () => await AuthService.logout(), {
    onSuccess: () => {
      dispatch(isClear())
      localStorage.removeItem('token')
      dispatch(setList({
        id: Date.now(),
        title: 'Success',
        description: 'Вы вышли из сессии!',
        backgroundColor: '#5cb85c'
      }))
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

  return { asyncLogout, isLoading }
}
