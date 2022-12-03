/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AxiosResponse } from 'axios'
import React from 'react'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from 'react-query'
import { UserService } from '../../service/user/user.service'
import { getUser } from '../../types/User.interface'

interface useGetFriendsType {
  asyncFriendsUser: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<AxiosResponse<getUser[], any>, unknown>>
  isFetching?: boolean
  friendsList: getUser[]
}

export const useGetFriends = (enabled: boolean = false): useGetFriendsType => {
  const [friendsList, setFriendsList] = React.useState<getUser[]>(null!)

  const { refetch: asyncFriendsUser, isFetching } = useQuery('friendsList', async () => await UserService.getFriends(), {
    onSuccess: ({ data }) => {
      setFriendsList(data)
    },
    onError: (err) => {
      console.log(err)
    },
    enabled
  })

  return { asyncFriendsUser, isFetching, friendsList }
}
