import classNames from 'classnames'
import type { ComponentProps } from 'react'
import { Kbd } from '../Kbd'
import styles from './Button.module.scss'

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'accent' | 'secondary' | 'danger' | 'dashed' | 'plain'
  size?: 'small' | 'medium'
  shortcut?: string[]
  isBusy?: boolean
  // A post action: its key hint only shows while the post it belongs to has focus.
  isPostShortcut?: boolean
}

export const Button = ({
  type = 'button',
  variant = 'secondary',
  size = 'medium',
  shortcut,
  isBusy = false,
  isPostShortcut = false,
  className,
  children,
  onClick,
  ...props
}: ButtonProps) => {
  // Busy, not disabled: a disabled button drops keyboard focus, a busy one keeps it.
  const handleClick: ButtonProps['onClick'] = (event) => {
    if (isBusy) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  return (
    <button
      type={type}
      className={classNames(styles.button, styles[variant], styles[size], className)}
      aria-disabled={isBusy || undefined}
      aria-busy={isBusy || undefined}
      onClick={handleClick}
      {...props}
    >
      {children}
      {shortcut && (
        <span className={styles.floatingHint}>
          <Kbd keys={shortcut} variant="compact" isPostHint={isPostShortcut} />
        </span>
      )}
    </button>
  )
}
