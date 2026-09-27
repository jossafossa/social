import { useEffect, useEffectEvent, useRef } from 'react'

// Drives a native <dialog> from `isOpen`: showModal gives focus trapping and Esc, and a click on the
// backdrop closes it too. The click must also have started on the backdrop, so selecting text inside
// and letting go outside keeps it open.
//
// For this to work the <dialog> element itself must be exactly the backdrop or the box, with its
// content filling it: a click whose target is the dialog element then landed outside the content.
export const useModalDialog = (isOpen: boolean, onClose: () => void) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const close = useEffectEvent(onClose)

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

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }
    let isPressOnBackdrop = false
    const handlePointerDown = (event: PointerEvent) => {
      isPressOnBackdrop = event.target === dialog
    }
    const handleClick = (event: MouseEvent) => {
      if (isPressOnBackdrop && event.target === dialog) {
        close()
      }
      isPressOnBackdrop = false
    }
    dialog.addEventListener('pointerdown', handlePointerDown)
    dialog.addEventListener('click', handleClick)
    return () => {
      dialog.removeEventListener('pointerdown', handlePointerDown)
      dialog.removeEventListener('click', handleClick)
    }
  }, [])

  return dialogRef
}
