import { Outlet, ScrollRestoration } from 'react-router'
import { getFileUrl } from '~/api'
import { AppShell, ShortcutHelp, Sidebar, Stack } from '~/components'
import { AppBreadcrumbs, GlobalSearch } from '~/features'
import {
  shortcutList,
  useCurrentUser,
  useLogout,
  useNavigationShortcuts,
  usePageFocus,
} from '~/hooks'

export const AppLayout = () => {
  const user = useCurrentUser()
  const handleLogout = useLogout()
  const { isHelpOpen, closeHelp } = useNavigationShortcuts()
  usePageFocus()

  return (
    <AppShell
      topBar={
        <Stack direction="row" justify="between" gap="medium" isWrapping={false}>
          <AppBreadcrumbs />
          <GlobalSearch />
        </Stack>
      }
      sidebar={
        <Sidebar
          account={
            user && {
              name: user.name,
              avatarSrc: getFileUrl(user, user.avatar, '64x64'),
              onLogout: handleLogout,
            }
          }
        />
      }
    >
      <Outlet />
      <ScrollRestoration />
      <ShortcutHelp shortcuts={shortcutList} isOpen={isHelpOpen} onClose={closeHelp} />
    </AppShell>
  )
}
