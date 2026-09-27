import { useEffect, useEffectEvent, useRef } from 'react'
import { useLocation } from 'react-router'

const wantsToKeepFocus = (state: unknown) =>
  typeof state === 'object' && state !== null && 'keepFocus' in state && state.keepFocus === true

// After navigating to another page, move focus to its title (or <main> while it loads), so keyboard
// and screen-reader users start at the new page instead of on the link they left behind. A page whose
// whole point is one field (the search page) marks it `data-page-autofocus` and gets it instead; list
// pages don't, or phones would pop up the keyboard on every visit. Query-string changes (searching)
// keep focus where it is; so do shortcuts that place it themselves.
export const usePageFocus = () => {
  const { pathname, state } = useLocation()
  const previousPathnameRef = useRef(pathname)

  const focusPage = useEffectEvent(() => {
    if (wantsToKeepFocus(state)) {
      return
    }
    const target =
      document.querySelector<HTMLElement>('main [data-page-autofocus]') ??
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
