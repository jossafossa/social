import { Navigate, Outlet } from 'react-router'
import { AuthShell, Stack } from '~/components'
import { AppBreadcrumbs, ThemeSwitch } from '~/features'
import { useCurrentUser, usePageFocus } from '~/hooks'
import { paths } from '~/paths'

export const GuestLayout = () => {
  const user = useCurrentUser()
  usePageFocus()

  if (user) {
    return <Navigate to={paths.home} replace />
  }

  return (
    <AuthShell
      topBar={
        <Stack direction="row" justify="between" gap="medium">
          <AppBreadcrumbs />
          <ThemeSwitch />
        </Stack>
      }
    >
      <Outlet />
    </AuthShell>
  )
}
