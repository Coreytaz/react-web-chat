/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AxiosResponse } from 'axios'
import React from 'react'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from 'react-query'
import { UserService } from '../../service/user/user.service'
import { getUser } from '../../types/User.interface'

interface useReguestUserType {
  asyncReguestUser: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<AxiosResponse<getUser[]>, unknown>>
  isLoadingRegUser?: boolean
  reguest: getUser[]
  setReguest: React.Dispatch<React.SetStateAction<getUser[]>>
}

export const useReguestUser = (): useReguestUserType => {
  const [reguest, setReguest] = React.useState<getUser[]>([])

  const { refetch: asyncReguestUser, isFetching: isLoadingRegUser } = useQuery('getReguestUser', async () => await UserService.getReguestUser(), {
    onSuccess: ({ data }) => {
      setReguest(data)
    },
    onError: (err) => {
      console.log(err)
    }
  })

  return { asyncReguestUser, isLoadingRegUser, reguest, setReguest }
}
