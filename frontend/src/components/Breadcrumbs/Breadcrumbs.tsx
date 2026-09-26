import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { paths } from '~/paths'
import styles from './Breadcrumbs.module.scss'

export type Crumb = {
  id: string
  label: ReactNode
  to?: string
}

type BreadcrumbsProps = {
  items: Crumb[]
}

// Reads like a shell path: ~ / groups / #cats. The last crumb is the current page.
export const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
    <ol className={styles.trail}>
      <li>
        {items.length === 0 ? (
          <span aria-current="page" className={styles.current}>
            ~
          </span>
        ) : (
          <Link to={paths.home} className={styles.link}>
            ~
          </Link>
        )}
      </li>
      {items.map(({ id, label, to }, index) => (
        <li key={id} className={styles.crumb}>
          <span aria-hidden="true" className={styles.separator}>
            /
          </span>
          {to !== undefined && index < items.length - 1 ? (
            <Link to={to} className={styles.link}>
              {label}
            </Link>
          ) : (
            <span aria-current="page" className={styles.current}>
              {label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
)
