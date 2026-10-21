import { useQuery, useQueryClient } from '@tanstack/react-query'
import { UserService } from '../../service/user/user.service'
import { keys } from '../../service/query'
import { useTypedSelector } from '../useTypedSelector'
import type { PublicUser } from '../../types/User.interface'
export const useFriendRequests = () => {
  const id = useTypedSelector((s) => s.authSlice.user._id)
  const client = useQueryClient()
  const query = useQuery({
    queryKey: keys.requests(id),
    queryFn: async ({ signal }) => (await UserService.getReguestUser(signal)).data,
    enabled: !!id
  })
  return {
    requests: query.data ?? [],
    isLoading: query.isFetching,
    error: query.error,
    setRequests: (update: (users: PublicUser[]) => PublicUser[]) =>
      client.setQueryData<PublicUser[]>(keys.requests(id), (old) => update(old ?? []))
  }
}
