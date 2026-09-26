import { Kbd } from '../Kbd'
import styles from './SearchTrigger.module.scss'

type SearchTriggerProps = {
  onClick: () => void
}

// Looks like a search field with its submit button, but is one button that opens the full-page
// search. Claims "/" as its shortcut.
export const SearchTrigger = ({ onClick }: SearchTriggerProps) => (
  <button
    type="button"
    className={styles.trigger}
    data-shortcut="/"
    aria-keyshortcuts="/"
    onClick={onClick}
  >
    <span className={styles.field}>
      <span className={styles.prompt}>$ search people &amp; groups…</span>
      <Kbd keys={['/']} />
    </span>
    <span className={styles.go}>SEARCH</span>
  </button>
)
