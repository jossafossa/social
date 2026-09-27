import { useState } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'
import { getFileUrl } from '~/api'
import { AppShell, ShortcutHelp, Sidebar, Stack } from '~/components'
import { AppBreadcrumbs, GlobalSearch, InstallButton, ThemeSwitch } from '~/features'
import {
  shortcutList,
  useCurrentUser,
  useLogout,
  useNavigationShortcuts,
  usePageFocus,
} from '~/hooks'
import { paths } from '~/paths'

export const AppLayout = () => {
  const user = useCurrentUser()
  const handleLogout = useLogout()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isHelpOpen, closeHelp } = useNavigationShortcuts()
  usePageFocus()

  const handleMenuOpen = () => setIsMenuOpen(true)
  const handleMenuClose = () => setIsMenuOpen(false)

  return (
    <AppShell
      quickLinks={[
        { label: 'home', to: paths.home, end: true },
        { label: user ? 'friends' : 'following', to: paths.friends },
        { label: 'groups', to: paths.groups },
        { label: 'search', to: paths.search },
      ]}
      isMenuOpen={isMenuOpen}
      onMenuOpen={handleMenuOpen}
      onMenuClose={handleMenuClose}
      topBar={
        <Stack direction="row" justify="between" gap="medium" isWrapping={false}>
          <AppBreadcrumbs />
          <GlobalSearch />
        </Stack>
      }
      sidebar={
        <Sidebar
          themeSwitch={<ThemeSwitch layout="stacked" />}
          installButton={<InstallButton />}
          onNavigate={handleMenuClose}
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
