import { useEffect } from 'react'

// Records how the person last drove the app on <html data-input-modality>: "keyboard" after moving
// around with keys, "pointer" after a mouse or touch press. Styles use it to show focus rings and
// key hints to keyboard users and to nobody else. Typing into a field you clicked isn't moving
// around, so it doesn't count; Tab and Escape always do.
const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

const navigationKeys = ['Tab', 'Escape']
export const useInputModality = () => {
  useEffect(() => {
    const root = document.documentElement
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['Shift', 'Meta', 'Control', 'Alt'].includes(event.key)) {
        return
      }
      if (navigationKeys.includes(event.key) || !isEditable(event.target)) {
        root.dataset.inputModality = 'keyboard'
      }
    }
    const handlePointerDown = () => {
      root.dataset.inputModality = 'pointer'
    }

    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('pointerdown', handlePointerDown, true)
    }
  }, [])
}
