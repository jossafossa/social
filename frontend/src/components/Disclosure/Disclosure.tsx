import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from '../Button'
import { Card } from '../Card'
import { Heading } from '../Heading'
import { Stack } from '../Stack'
import styles from './Disclosure.module.scss'

type DisclosureProps = {
  label: string
  children: (onClose: () => void) => ReactNode
  title?: string
  renderTrigger?: (onOpen: () => void) => ReactNode
}

// The opened content gets `onClose` and renders its own cancel next to its own submit. Closing puts
// keyboard focus back on the trigger.
export const Disclosure = ({ label, children, title, renderTrigger }: DisclosureProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      triggerRef.current?.querySelector<HTMLElement>('button, a')?.focus()
    }
    wasOpenRef.current = isOpen
  }, [isOpen])

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  if (!isOpen) {
    return (
      <div ref={triggerRef} className={styles.trigger}>
        {renderTrigger ? (
          renderTrigger(handleOpen)
        ) : (
          <Stack direction="row">
            <Button size="small" onClick={handleOpen}>
              {label}
            </Button>
          </Stack>
        )}
      </div>
    )
  }

  if (title === undefined) {
    return children(handleClose)
  }

  return (
    <Card as="section" variant="accent">
      <Heading level={2}>{title}</Heading>
      {children(handleClose)}
    </Card>
  )
}
