import classNames from 'classnames'
import type { FormEvent } from 'react'
import { findShortcut } from '~/utils'
import { Kbd } from '../Kbd'
import styles from './SearchBar.module.scss'

type SearchBarProps = {
  label: string
  onSearch: (query: string) => void
  defaultValue?: string
  variant?: 'full' | 'compact'
}

export const SearchBar = ({ label, onSearch, defaultValue, variant = 'full' }: SearchBarProps) => {
  const isCompact = variant === 'compact'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = new FormData(event.currentTarget).get('query')
    onSearch(typeof query === 'string' ? query.trim() : '')
  }

  return (
    <search>
      <form className={classNames(styles.bar, isCompact && styles.compact)} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.prompt}>$</span>
          <input
            type="search"
            name="query"
            aria-label={label}
            defaultValue={defaultValue}
            className={styles.input}
            data-page-search
            aria-keyshortcuts={findShortcut.aria}
          />
          {!isCompact && <Kbd keys={findShortcut.keys} />}
        </label>
        <button type="submit" className={styles.submit}>
          SEARCH
        </button>
      </form>
    </search>
  )
}
