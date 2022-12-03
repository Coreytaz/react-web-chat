/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AxiosResponse } from 'axios'
import React from 'react'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { UserService } from '../../service/user/user.service'
import { getSearchUser } from '../../types/User.interface'

interface useSearchUsersType {
  refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<AxiosResponse<getSearchUser>, unknown>>
  isFetching?: boolean
  userList: getSearchUser
}

export const useSearchUsers = (): useSearchUsersType => {
  const [searchParams] = useSearchParams()
  const username = searchParams.get('username') ?? ''
  const [userList, setUserList] = React.useState<getSearchUser>(null!)

  const { refetch, isFetching } = useQuery('userList', async () => await UserService.getListUser(username), {
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
