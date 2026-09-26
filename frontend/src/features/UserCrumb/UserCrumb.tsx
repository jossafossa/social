import { useGetUserQuery } from '~/api'

type UserCrumbProps = {
  userId: string
}

// Same query and argument as the user page, so this reads the cache instead of fetching again.
export const UserCrumb = ({ userId }: UserCrumbProps) => {
  const { data: user } = useGetUserQuery(userId)
  if (!user) {
    return '…'
  }
  // The trail cuts long names off; the title keeps the full one reachable.
  return <span title={user.name}>{user.name}</span>
}
