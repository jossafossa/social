import { Fragment } from 'react'
import { Button } from '../Button'
import { Heading } from '../Heading'
import { Kbd } from '../Kbd'
import { Stack } from '../Stack'
import { useModalDialog } from '../useModalDialog'
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
  const dialogRef = useModalDialog(isOpen, onClose)

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={onClose}>
      {/* Fills the dialog, so only a click on the backdrop has the dialog itself as its target. */}
      <Stack gap="large" className={styles.content}>
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
