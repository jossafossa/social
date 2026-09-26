import classNames from 'classnames'
import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router'
import buttonStyles from '../Button/Button.module.scss'
import { Kbd } from '../Kbd'

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, 'to' | 'className' | 'children'> & {
  children: ReactNode
  to: string
  variant?: 'primary' | 'accent' | 'secondary'
  size?: 'small' | 'medium'
  shortcut?: string[]
}

export const ButtonLink = ({
  children,
  to,
  variant = 'secondary',
  size = 'medium',
  shortcut,
  ...props
}: ButtonLinkProps) => (
  <Link
    to={to}
    className={classNames(
      buttonStyles.button,
      buttonStyles[variant],
      buttonStyles[size],
      buttonStyles.link,
    )}
    {...props}
  >
    {children}
    {shortcut && (
      <span className={buttonStyles.floatingHint}>
        <Kbd keys={shortcut} variant="compact" />
      </span>
    )}
  </Link>
)
