import classNames from 'classnames'
import type { ReactNode } from 'react'
import { Stack } from '../Stack'
import styles from './Page.module.scss'

type PageProps = {
  children: ReactNode
  aside?: ReactNode
}

// A page's content column, optionally with a right-hand column beside it.
export const Page = ({ children, aside }: PageProps) => (
  <div className={classNames(styles.page, aside !== undefined && styles.withAside)}>
    <Stack gap="large">{children}</Stack>
    {aside !== undefined && (
      <Stack as="aside" gap="large" className={styles.aside}>
        {aside}
      </Stack>
    )}
  </div>
)
