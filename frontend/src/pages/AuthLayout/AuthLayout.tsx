import { Outlet } from 'react-router'
import { AuthShell, Stack } from '~/components'
import { AppBreadcrumbs, ThemeSwitch } from '~/features'
import { usePageFocus } from '~/hooks'

// The sign-in look, for anyone: GuestLayout adds sending members home.
export const AuthLayout = () => {
  usePageFocus()

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
