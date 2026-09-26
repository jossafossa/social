import type { ReactNode } from 'react'
import styles from './AuthShell.module.scss'

type AuthShellProps = {
  children: ReactNode
  topBar?: ReactNode
}

export const AuthShell = ({ children, topBar }: AuthShellProps) => (
  <div className={styles.shell}>
    <a href="#main" className={styles.skipLink}>
      skip to content
    </a>
    <section className={styles.poster}>
      <span className={styles.brand}>pb/social_</span>
      <p className={styles.slogan}>
        friends.
        <br />
        groups.
        <br />
        <span className={styles.accent}>posts.</span>
      </p>
      <span className={styles.footnote}>runs on pocketbase</span>
    </section>
    <main id="main" tabIndex={-1} className={styles.main}>
      {topBar && <div className={styles.topBar}>{topBar}</div>}
      <div className={styles.card}>{children}</div>
    </main>
  </div>
)
