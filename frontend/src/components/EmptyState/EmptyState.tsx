import type { ReactNode } from 'react'
import styles from './EmptyState.module.scss'

type EmptyStateProps = {
  children: ReactNode
}

export const EmptyState = ({ children }: EmptyStateProps) => (
  <p className={styles.empty}>{children}</p>
)
