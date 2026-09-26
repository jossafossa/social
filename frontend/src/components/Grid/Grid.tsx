import classNames from 'classnames'
import type { ReactNode } from 'react'
import styles from './Grid.module.scss'

type GridProps = {
  children: ReactNode
  columns: 2 | 3
  as?: 'div' | 'ul'
}

export const Grid = ({ children, columns, as: Element = 'div' }: GridProps) => (
  <Element className={classNames(styles.grid, styles[`columns-${columns}`])}>{children}</Element>
)
