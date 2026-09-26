import type { ReactNode } from 'react'
import styles from './AppShell.module.scss'

type AppShellProps = {
  sidebar: ReactNode
  children: ReactNode
  topBar?: ReactNode
}

export const AppShell = ({ sidebar, children, topBar }: AppShellProps) => (
  <div className={styles.shell}>
    <a href="#main" className={styles.skipLink}>
      skip to content
    </a>
    {sidebar}
    <div className={styles.column}>
      {topBar && <header className={styles.topBar}>{topBar}</header>}
      <main id="main" tabIndex={-1} className={styles.main}>
        {children}
      </main>
    </div>
  </div>
)
