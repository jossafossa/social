import classNames from 'classnames'
import type { AriaRole, ReactNode } from 'react'
import styles from './Text.module.scss'

type TextProps = {
  children: ReactNode
  as?: 'p' | 'span'
  size?: 'small' | 'body' | 'large'
  tone?: 'default' | 'muted'
  role?: AriaRole
}

export const Text = ({
  children,
  as: Element = 'p',
  size = 'body',
  tone = 'default',
  role,
}: TextProps) => (
  <Element className={classNames(styles.text, styles[size], styles[tone])} role={role}>
    {children}
  </Element>
)
