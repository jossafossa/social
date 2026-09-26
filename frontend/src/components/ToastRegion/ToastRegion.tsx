import type { ReactNode } from 'react'
import styles from './ToastRegion.module.scss'

type ToastRegionProps = {
  children: ReactNode
}

export const ToastRegion = ({ children }: ToastRegionProps) => (
  <section aria-label="Notifications" className={styles.region}>
    {children}
  </section>
)
