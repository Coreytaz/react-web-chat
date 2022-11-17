/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AxiosResponse } from 'axios'
import React from 'react'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from 'react-query'
import { UserService } from '../../service/user/user.service'
import { getUser } from '../../types/User.interface'

interface useGetUserType {
  asyncUser: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<AxiosResponse<getUser>, unknown>>
  isFetching?: boolean
  selectedUser: getUser
}

export const useGetUser = (userId: string): useGetUserType => {
  const [selectedUser, setSelectedUser] = React.useState<getUser>(null!)

  const { refetch: asyncUser, isFetching } = useQuery('getUser', async () => await UserService.getUser(userId), {
    onSuccess: ({ data }) => {
      setSelectedUser(data)
    },
    onError: (err) => {
      console.log(err)
    },
    enabled: false
  })

  return { asyncUser, isFetching, selectedUser }
}
