import classNames from 'classnames'
import type { ReactNode } from 'react'
import styles from './Stack.module.scss'

type StackProps = {
  children: ReactNode
  as?: 'div' | 'section' | 'header' | 'nav' | 'ul' | 'main' | 'aside'
  direction?: 'row' | 'column'
  gap?: 'none' | 'small' | 'medium' | 'large'
  align?: 'stretch' | 'start' | 'center'
  justify?: 'start' | 'between'
  // Rows wrap by default; off, the items shrink instead (a long name then cuts off).
  isWrapping?: boolean
  className?: string
}

// Column stacks stretch their children by default; row stacks centre them and keep their natural
// size, so inline controls like buttons belong in a row.
export const Stack = ({
  children,
  as: Element = 'div',
  direction = 'column',
  gap = 'small',
  align,
  justify = 'start',
  isWrapping = true,
  className,
}: StackProps) => (
  <Element
    className={classNames(
      styles.stack,
      styles[direction],
      styles[`gap-${gap}`],
      align && styles[`align-${align}`],
      styles[`justify-${justify}`],
      !isWrapping && styles.noWrap,
      className,
    )}
  >
    {children}
  </Element>
)
