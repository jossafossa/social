import type { ReactNode } from 'react'
import { Heading } from '../Heading'
import { Stack } from '../Stack'
import styles from './ErrorScreen.module.scss'

type ErrorScreenProps = {
  title: string
  children: ReactNode
}

// Stands alone on purpose: it replaces whatever crashed, layouts included.
export const ErrorScreen = ({ title, children }: ErrorScreenProps) => (
  <main className={styles.screen}>
    <Stack gap="large" className={styles.card}>
      <Heading level={1}>{title}</Heading>
      {children}
    </Stack>
  </main>
)
