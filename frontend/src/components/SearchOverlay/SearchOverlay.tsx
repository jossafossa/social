import { useEffect, useRef, type FormEvent } from 'react'
import { Kbd } from '../Kbd'
import { Text } from '../Text'
import styles from './SearchOverlay.module.scss'

type SearchOverlayProps = {
  isOpen: boolean
  onClose: () => void
  onSearch: (query: string) => void
}

// Full-page search. A native modal dialog: it traps focus, focuses the input and closes on Esc.
export const SearchOverlay = ({ isOpen, onClose, onSearch }: SearchOverlayProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }
    if (isOpen && !dialog.open) {
      dialog.showModal()
    }
    if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const query = new FormData(form).get('query')
    const trimmed = typeof query === 'string' ? query.trim() : ''
    if (trimmed === '') {
      return
    }
    form.reset()
    onSearch(trimmed)
  }

  return (
    <dialog ref={dialogRef} className={styles.overlay} aria-label="Search" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.prompt} aria-hidden="true">
            $
          </span>
          <input
            type="search"
            name="query"
            aria-label="Search people and groups"
            placeholder="search people & groups"
            className={styles.input}
          />
          <button type="submit" className={styles.submit}>
            SEARCH
          </button>
        </label>
        <span className={styles.hint}>
          <Text as="span" size="small">
            <Kbd keys={['↵']} /> search · <Kbd keys={['Esc']} /> close
          </Text>
        </span>
      </form>
    </dialog>
  )
}
