import { useEffect, useEffectEvent, useRef } from 'react'
import { useLocation } from 'react-router'

const wantsToKeepFocus = (state: unknown) =>
  typeof state === 'object' && state !== null && 'keepFocus' in state && state.keepFocus === true

// A search box in the page's own column; the one in a side column is a shortcut, not the page's job.
const findPageSearch = () =>
  [...document.querySelectorAll<HTMLElement>('main [data-page-search]')].find(
    (input) => input.closest('aside') === null,
  )

// After navigating to another page, move focus to its search box, else its title (or <main> while
// it loads), so keyboard and screen-reader users start at the new page instead of on the link they
// left behind. Query-string changes (searching) keep focus where it is; so do shortcuts that place
// it themselves.
export const usePageFocus = () => {
  const { pathname, state } = useLocation()
  const previousPathnameRef = useRef(pathname)

  const focusPage = useEffectEvent(() => {
    if (wantsToKeepFocus(state)) {
      return
    }
    const target =
      findPageSearch() ??
      document.querySelector<HTMLElement>('main h1') ??
      document.querySelector<HTMLElement>('main')
    target?.focus({ preventScroll: true })
  })

  useEffect(() => {
    if (previousPathnameRef.current === pathname) {
      return
    }
    previousPathnameRef.current = pathname
    focusPage()
  }, [pathname])
}
