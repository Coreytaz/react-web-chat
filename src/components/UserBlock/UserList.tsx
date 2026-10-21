import type { ReactNode } from 'react'
import type { PublicUser } from '../../types/User.interface'
import UserBlock from './UserBlock'
import UserBlockReqSkeleton from './UserBlockReqSkeleton'
interface UserListProps<User extends PublicUser> {
  users: User[]
  loading: boolean
  error: Error | null
  errorMessage: string
  empty: ReactNode
  className: string
  rowClassName: string
  skeletonCount?: number
  renderAction: (user: User) => ReactNode
}
export default function UserList<User extends PublicUser>({
  users,
  loading,
  error,
  errorMessage,
  empty,
  className,
  rowClassName,
  skeletonCount = 3,
  renderAction
}: UserListProps<User>) {
  let content: ReactNode
  if (error) content = <p role="alert">{errorMessage}</p>
  else if (loading)
    content = Array.from({ length: skeletonCount }, (_, index) => (
      <div className={rowClassName} key={index}>
        <UserBlockReqSkeleton />
      </div>
    ))
  else if (!users.length) content = empty
  else
    content = users.map((user) => (
      <div className={rowClassName} key={user._id}>
        <div>
          <UserBlock {...user} />
        </div>
        {renderAction(user)}
      </div>
    ))
  return <div className={className}>{content}</div>
}
