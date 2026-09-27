import classNames from 'classnames'
import { useRef, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router'
import { paths } from '~/paths'
import { Avatar } from '../Avatar'
import { ButtonLink } from '../ButtonLink'
import { Kbd } from '../Kbd'
import { useArrowNavigation } from '../useArrowNavigation'
import styles from './Sidebar.module.scss'

type Account = {
  name: string
  onLogout: () => void
  avatarSrc?: string
}

type SidebarProps = {
  // Left out for a visitor: they get log in / sign up instead, and follow people instead of
  // having friends.
  account?: Account
  // The light / dark / device switch, at the bottom.
  themeSwitch?: ReactNode
}

const toNavItems = (isGuest: boolean) => [
  { label: 'home', to: paths.home },
  { label: isGuest ? 'following' : 'friends', to: paths.friends },
  { label: 'groups', to: paths.groups },
]

const toNavClassName = ({ isActive }: { isActive: boolean }) =>
  classNames(styles.item, isActive && styles.active)

export const Sidebar = ({ account, themeSwitch }: SidebarProps) => {
  const itemsRef = useRef<HTMLUListElement>(null)
  // ↑ ↓ move through the menu, on top of Tab.
  useArrowNavigation(itemsRef, 1)

  return (
    <nav className={styles.sidebar} aria-label="Main">
      <Link to={paths.home} className={styles.brand}>
        pb/social_
      </Link>
      <ul ref={itemsRef} className={styles.items}>
        {toNavItems(account === undefined).map(({ label, to }) => (
          <li key={to} data-arrow-item>
            <NavLink to={to} end={to === paths.home} className={toNavClassName}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <span className={styles.hint}>
        <Kbd keys={['[', ']']} /> switch section
      </span>
      <div className={styles.spacer} />
      {account ? (
        <NavLink
          to={paths.settings}
          data-shortcut=","
          aria-keyshortcuts=","
          className={({ isActive }) => classNames(styles.user, isActive && styles.userActive)}
        >
          <Avatar name={account.name} size="small" src={account.avatarSrc} />
          <span className={styles.userText}>
            <strong title={account.name}>{account.name}</strong>
            <span className={styles.userHint}>
              settings <Kbd keys={[',']} variant="inline" />
            </span>
          </span>
        </NavLink>
      ) : (
        <div className={styles.guest}>
          <span className={styles.guestText}>reading as a guest</span>
          <ButtonLink to={paths.login} variant="primary" size="small">
            log in
          </ButtonLink>
          <ButtonLink to={paths.register} size="small">
            sign up
          </ButtonLink>
        </div>
      )}
      {themeSwitch}
      <div className={styles.footer}>
        {account && (
          <button type="button" className={styles.logout} onClick={account.onLogout}>
            log out
          </button>
        )}
        <span className={styles.hint}>
          <Kbd keys={['?']} /> shortcuts
        </span>
      </div>
    </nav>
  )
}
