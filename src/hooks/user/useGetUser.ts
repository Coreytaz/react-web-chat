/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AxiosResponse } from 'axios'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { UserService } from '../../service/user/user.service'
import { getUser } from '../../types/User.interface'
import { useAction } from '../useAction'

interface useGetUserType {
  asyncUser: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<AxiosResponse<getUser>, unknown>>
  isFetching?: boolean
  userId: string | null
}

export const useGetUser = (): useGetUserType => {
  const { selectUser } = useAction()
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('sel')

  const { refetch: asyncUser, isFetching } = useQuery('getUser', async () => await UserService.getUser(userId), {
    onSuccess: ({ data }) => {
      selectUser(data)
    },
    onError: (err) => {
      console.log(err)
    },
    enabled: false
  })

  return { asyncUser, isFetching, userId }
}
