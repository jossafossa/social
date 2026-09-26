import { useEffect, useRef } from 'react'

// When something that was opened closes again (a form, an editor), put keyboard focus back on the
// control that opened it instead of dropping it on <body>.
export const useFocusReturn = <Element extends HTMLElement>(isOpen: boolean) => {
  const triggerRef = useRef<Element>(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      triggerRef.current?.focus()
    }
    wasOpenRef.current = isOpen
  }, [isOpen])

  return triggerRef
}
