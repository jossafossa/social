import { Fragment, useEffect, useRef } from 'react'
import { Button } from '../Button'
import { Heading } from '../Heading'
import { Kbd } from '../Kbd'
import { Stack } from '../Stack'
import styles from './ShortcutHelp.module.scss'

type Shortcut = {
  keys: string[]
  description: string
}

type ShortcutHelpProps = {
  shortcuts: Shortcut[]
  isOpen: boolean
  onClose: () => void
}

export const ShortcutHelp = ({ shortcuts, isOpen, onClose }: ShortcutHelpProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // The native dialog is opened imperatively; showModal gives focus trapping and Esc for free.
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

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={onClose}>
      <Stack gap="large">
        <Heading level={2}>keyboard shortcuts</Heading>
        <dl className={styles.list}>
          {shortcuts.map(({ keys, description }) => (
            <Fragment key={description}>
              <dt className={styles.keys}>
                <Kbd keys={keys} />
              </dt>
              <dd className={styles.description}>{description}</dd>
            </Fragment>
          ))}
        </dl>
        <Stack direction="row">
          <Button variant="primary" onClick={onClose}>
            close
          </Button>
        </Stack>
      </Stack>
    </dialog>
  )
}
