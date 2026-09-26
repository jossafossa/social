import classNames from 'classnames'
import { useEffect, useEffectEvent } from 'react'
import styles from './Toast.module.scss'

type ToastProps = {
  message: string
  variant: 'error' | 'status'
  onDismiss: () => void
  durationMs?: number
}

export const Toast = ({ message, variant, onDismiss, durationMs = 6000 }: ToastProps) => {
  // An effect event so a parent re-render (a new onDismiss) doesn't restart the countdown.
  const handleTimeout = useEffectEvent(onDismiss)

  useEffect(() => {
    const timeout = window.setTimeout(handleTimeout, durationMs)
    return () => window.clearTimeout(timeout)
  }, [durationMs])

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={classNames(styles.toast, styles[variant])}
    >
      <span className={styles.message}>{message}</span>
      <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={onDismiss}>
        ×
      </button>
    </div>
  )
}
