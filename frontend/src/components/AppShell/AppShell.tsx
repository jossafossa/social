import classNames from 'classnames'
import { useEffect, useEffectEvent, useRef, type ReactNode } from 'react'
import styles from './AppShell.module.scss'

type AppShellProps = {
  sidebar: ReactNode
  children: ReactNode
  topBar?: ReactNode
  // Narrow screens: the sidebar slides in over the page. The layout owns the state, so the sidebar's
  // links can close it when they navigate.
  isMenuOpen?: boolean
  onMenuOpen?: () => void
  onMenuClose?: () => void
}

// Keep in step with $drawer in styles/breakpoints.scss.
const drawerQuery = '(max-width: 899.98px)'

export const AppShell = ({
  sidebar,
  children,
  topBar,
  isMenuOpen = false,
  onMenuOpen,
  onMenuClose,
}: AppShellProps) => {
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const shouldReturnFocusRef = useRef(false)
  const closeMenu = useEffectEvent(() => onMenuClose?.())

  // Closed by the person (Esc, the scrim): focus goes back to the menu button. Closed by following a
  // link, the new page takes focus instead.
  const handleClose = () => {
    shouldReturnFocusRef.current = true
    onMenuClose?.()
  }
  const closeAndReturnFocus = useEffectEvent(handleClose)

  // After the close has rendered: the button sits in the part that was inert, which can't take focus.
  useEffect(() => {
    if (!isMenuOpen && shouldReturnFocusRef.current) {
      shouldReturnFocusRef.current = false
      menuButtonRef.current?.focus()
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }
    drawerRef.current?.querySelector<HTMLElement>('a[href], button')?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAndReturnFocus()
      }
    }
    // Widened past the drawer breakpoint: the sidebar is back in place, so there is no menu to have open.
    const media = window.matchMedia(drawerQuery)
    const handleMediaChange = () => {
      if (!media.matches) {
        closeMenu()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    media.addEventListener('change', handleMediaChange)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      media.removeEventListener('change', handleMediaChange)
    }
  }, [isMenuOpen])

  return (
    <div className={classNames(styles.shell, isMenuOpen && styles.menuOpen)}>
      <a href="#main" className={styles.skipLink}>
        skip to content
      </a>
      <div ref={drawerRef} id="menu" className={styles.drawer}>
        {sidebar}
      </div>
      {isMenuOpen && (
        <button
          type="button"
          className={styles.scrim}
          aria-label="close menu"
          tabIndex={-1}
          onClick={handleClose}
        />
      )}
      {/* While the menu is open, the page behind it can't be reached. */}
      <div className={styles.column} inert={isMenuOpen}>
        {topBar && (
          <header className={styles.topBar}>
            <button
              ref={menuButtonRef}
              type="button"
              className={styles.menuButton}
              aria-expanded={isMenuOpen}
              aria-controls="menu"
              onClick={onMenuOpen}
            >
              ≡ menu
            </button>
            <div className={styles.topBarContent}>{topBar}</div>
          </header>
        )}
        <main id="main" tabIndex={-1} className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  )
}
