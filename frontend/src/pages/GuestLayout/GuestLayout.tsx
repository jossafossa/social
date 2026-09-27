import { Navigate } from 'react-router'
import { useCurrentUser } from '~/hooks'
import { paths } from '~/paths'
import { AuthLayout } from '../AuthLayout'

export const GuestLayout = () => {
  const user = useCurrentUser()

  if (user) {
    return <Navigate to={paths.home} replace />
  }

  return <AuthLayout />
}
