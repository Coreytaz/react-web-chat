import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { UserService } from '../../service/user/user.service'
import { keys } from '../../service/query'
import { useTypedSelector } from '../useTypedSelector'
export const useGetUser = () => {
  const [params] = useSearchParams()
  const userId = params.get('sel') || ''
  const id = useTypedSelector((s) => s.authSlice.user._id)
  const query = useQuery({
    queryKey: keys.user(id, userId),
    queryFn: async ({ signal }) => (await UserService.getUser(userId, signal)).data,
    enabled: !!id && !!userId
  })
  return { userId, selectedUser: query.data, isFetching: query.isPending, error: query.error }
}
