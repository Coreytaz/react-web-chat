import { useQuery } from '@tanstack/react-query'
import { UserService } from '../../service/user/user.service'
import { keys } from '../../service/query'
import { useTypedSelector } from '../useTypedSelector'
export const useGetFriends = () => {
  const id = useTypedSelector((s) => s.authSlice.user._id)
  const query = useQuery({
    queryKey: keys.friends(id),
    queryFn: async ({ signal }) => (await UserService.getFriends(signal)).data,
    enabled: !!id
  })
  return { friendsList: query.data ?? [], isFetching: query.isFetching, error: query.error }
}
