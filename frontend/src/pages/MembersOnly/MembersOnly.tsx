import { Navigate, Outlet } from 'react-router'
import { useCurrentUser } from '~/hooks'
import { paths } from '~/paths'

// Pages that only make sense with an account (settings, creating a group): visitors log in first.
export const MembersOnly = () => {
  const user = useCurrentUser()
  return user ? <Outlet /> : <Navigate to={paths.login} replace />
}
