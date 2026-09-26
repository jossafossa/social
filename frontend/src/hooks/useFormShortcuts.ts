import { useEffect } from 'react'

// Anywhere in a form: ⌘/Ctrl+Enter submits it, Escape presses its cancel button. Escape in a page
// search box leaves it, so single-key shortcuts work again.
export const useFormShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.target instanceof HTMLElement)) {
        return
      }
      const form = event.target.closest('form')
      if (!form) {
        return
      }
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        form.requestSubmit()
      }
      if (event.key === 'Escape') {
        const isPageSearch =
          event.target instanceof HTMLInputElement &&
          event.target.type === 'search' &&
          !event.target.closest('dialog')
        if (isPageSearch) {
          event.target.blur()
          return
        }
        form.querySelector<HTMLButtonElement>('[data-cancel]')?.click()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}
