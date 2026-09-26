import { Navigate, Outlet } from 'react-router'
import { AuthShell } from '~/components'
import { AppBreadcrumbs } from '~/features'
import { useCurrentUser, usePageFocus } from '~/hooks'
import { paths } from '~/paths'

export const GuestLayout = () => {
  const user = useCurrentUser()
  usePageFocus()

  if (user) {
    return <Navigate to={paths.home} replace />
  }

  return (
    <AuthShell topBar={<AppBreadcrumbs />}>
      <Outlet />
    </AuthShell>
  )
}
