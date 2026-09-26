import classNames from 'classnames'
import type { ReactNode } from 'react'
import truncateStyles from '~/styles/truncate.module.scss'
import styles from './Heading.module.scss'

type HeadingProps = {
  children: ReactNode
  level: 1 | 2
  // The full text. Giving it keeps the heading on one line, cut off with an ellipsis, and shows the
  // full text on hover. For headings holding a name.
  title?: string
}

export const Heading = ({ children, level, title }: HeadingProps) => {
  const truncate = title !== undefined && truncateStyles.truncate
  if (level === 1) {
    // Focusable by script only: navigation moves focus here so the new page is announced.
    return (
      <h1 className={classNames(styles.title, truncate)} title={title} tabIndex={-1}>
        {children}
      </h1>
    )
  }
  return (
    <h2 className={classNames(styles.label, truncate)} title={title}>
      {children}
    </h2>
  )
}
