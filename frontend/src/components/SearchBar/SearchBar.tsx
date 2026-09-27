import classNames from 'classnames'
import { useEffect, useRef, type FormEvent } from 'react'
import { findShortcut } from '~/utils'
import { Kbd } from '../Kbd'
import styles from './SearchBar.module.scss'

type SearchBarProps = {
  label: string
  onSearch: (query: string) => void
  defaultValue?: string
  variant?: 'full' | 'compact'
  // Takes focus when its page opens (see usePageFocus); only for a page that is just this search.
  isPageAutofocus?: boolean
}

export const SearchBar = ({
  label,
  onSearch,
  defaultValue,
  variant = 'full',
  isPageAutofocus = false,
}: SearchBarProps) => {
  const isCompact = variant === 'compact'
  const inputRef = useRef<HTMLInputElement>(null)

  // The query can change from outside (back / forward): show it. Not while you're in the box, which
  // is where a new search came from; it keeps your text and your cursor.
  useEffect(() => {
    const input = inputRef.current
    if (input && document.activeElement !== input) {
      input.value = defaultValue ?? ''
    }
  }, [defaultValue])

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
            ref={inputRef}
            type="search"
            name="query"
            aria-label={label}
            defaultValue={defaultValue}
            className={styles.input}
            data-page-search
            data-page-autofocus={isPageAutofocus || undefined}
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
