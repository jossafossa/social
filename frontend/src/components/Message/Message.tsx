import classNames from 'classnames'
import type { ReactNode } from 'react'
import styles from './Message.module.scss'

type MessageProps = {
  children: ReactNode
  variant: 'error' | 'status' | 'notice'
}

export const Message = ({ children, variant }: MessageProps) => (
  <p
    role={variant === 'error' ? 'alert' : 'status'}
    className={classNames(styles.message, styles[variant])}
  >
    {children}
  </p>
)
