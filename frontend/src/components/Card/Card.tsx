import classNames from 'classnames'
import type { ReactNode } from 'react'
import { Stack } from '../Stack'
import styles from './Card.module.scss'

type CardProps = {
  children: ReactNode
  as?: 'div' | 'section'
  variant?: 'default' | 'accent' | 'danger'
  gap?: 'small' | 'medium'
}

export const Card = ({ children, as = 'div', variant = 'default', gap = 'medium' }: CardProps) => (
  <Stack as={as} gap={gap} className={classNames(styles.card, styles[variant])}>
    {children}
  </Stack>
)
