import { useEffect, useRef, type RefObject } from 'react'

const focusTargetSelector = '[data-post], a[href], button'

// After "load more", put focus on the first newly loaded item — where reading continues. If
// nothing new arrived (the button then disappears), fall back to the last item instead of <body>.
export const useLoadMoreFocus = (
  listRef: RefObject<HTMLElement | null>,
  itemCount: number,
  isLoading: boolean,
) => {
  const pendingIndexRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const index = pendingIndexRef.current
    if (index === undefined || isLoading) {
      return
    }
    pendingIndexRef.current = undefined
    const items = listRef.current?.querySelectorAll<HTMLElement>(':scope > li')
    const item = items?.[Math.min(index, itemCount - 1)]
    const target = item?.matches('[tabindex]')
      ? item
      : item?.querySelector<HTMLElement>(focusTargetSelector)
    target?.focus()
  }, [listRef, itemCount, isLoading])

  return () => {
    pendingIndexRef.current = itemCount
  }
}
