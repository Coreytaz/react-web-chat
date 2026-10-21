import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { UserService } from '../../service/user/user.service'
import { keys } from '../../service/query'
import useDebounce from '../useDebounce'
import { useTypedSelector } from '../useTypedSelector'
export const useSearchUsers = () => {
  const [params] = useSearchParams()
  const search = useDebounce(params.get('username') || '', 500)
  const id = useTypedSelector((s) => s.authSlice.user._id)
  const query = useQuery({
    queryKey: keys.search(id, search),
    queryFn: async ({ signal }) => (await UserService.getListUser(search, signal)).data,
    enabled: !!id
  })
  return { userList: query.data, isFetching: query.isFetching, error: query.error }
}
