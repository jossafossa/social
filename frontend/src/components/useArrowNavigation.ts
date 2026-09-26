import { useEffect, type RefObject } from 'react'

const itemSelector = '[data-arrow-item]'
const focusableSelector = 'a[href], button'

const moves: Record<string, (index: number, count: number, columns: number) => number> = {
  ArrowRight: (index) => index + 1,
  ArrowLeft: (index) => index - 1,
  ArrowDown: (index, _count, columns) => index + columns,
  ArrowUp: (index, _count, columns) => index - columns,
  Home: () => 0,
  End: (_index, count) => count - 1,
}

// Arrow keys move between the `[data-arrow-item]`s, as a shortcut on top of Tab. Every item stays
// in the tab order: these are lists of destinations, not one composite control, so Tab has to
// reach each of them.
export const useArrowNavigation = (
  containerRef: RefObject<HTMLElement | null>,
  columns: number,
  isEnabled = true,
) => {
  useEffect(() => {
    const container = containerRef.current
    if (!container || !isEnabled) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const move = moves[event.key]
      if (!move || !(event.target instanceof Element)) {
        return
      }
      const items = [...container.querySelectorAll<HTMLElement>(itemSelector)]
      const index = items.findIndex((item) => item.contains(event.target as Node))
      if (index === -1) {
        return
      }
      const next = move(index, items.length, columns)
      event.preventDefault()
      // Nothing in that direction (edge of the list, or no row below): stay put.
      if (next < 0 || next >= items.length) {
        return
      }
      items[next].querySelector<HTMLElement>(focusableSelector)?.focus()
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [containerRef, columns, isEnabled])
}
