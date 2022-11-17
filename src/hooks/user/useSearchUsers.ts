/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AxiosResponse } from 'axios'
import React from 'react'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from 'react-query'
import { UserService } from '../../service/user/user.service'
import { getSearchUser } from '../../types/User.interface'

interface useSearchUsersType {
  refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<AxiosResponse<getSearchUser>, unknown>>
  isFetching?: boolean
  userList: getSearchUser
}

export const useSearchUsers = (username?: string, email?: string): useSearchUsersType => {
  const [userList, setUserList] = React.useState<getSearchUser>(null!)

  const { refetch, isFetching } = useQuery('userList', async () => await UserService.getListUser(username, email), {
    onSuccess: ({ data }) => {
      setUserList(data)
    },
    onError: (err) => {
      console.log(err)
    },
    enabled: false
  })

  return { refetch, isFetching, userList }
}
