import { useEffect, useEffectEvent, useState } from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router'
import { paths } from '~/paths'
import { cancelShortcut, findShortcut, submitShortcut } from '~/utils'

export const shortcutList: { keys: string[]; description: string }[] = [
  { keys: ['['], description: 'previous section' },
  { keys: [']'], description: 'next section' },
  { keys: [','], description: 'settings' },
  { keys: ['/'], description: 'search people & groups' },
  { keys: findShortcut.keys, description: "jump to this page's search box" },
  { keys: ['n'], description: 'new post (new group on groups)' },
  { keys: ['j', 'k'], description: 'next / previous post' },
  { keys: ['l'], description: 'like the focused post' },
  { keys: ['c'], description: 'show comments on the focused post' },
  { keys: ['r'], description: 'reply to the focused post (comments open)' },
  { keys: ['e'], description: 'edit the focused post (your own)' },
  { keys: ['↑', '↓'], description: 'move through the menu and group grids' },
  { keys: submitShortcut.keys, description: 'submit the form you are in' },
  { keys: cancelShortcut.keys, description: 'cancel the form you are in' },
  { keys: ['?'], description: 'show these shortcuts' },
]

// The top-level sections [ and ] step through, in sidebar order.
const sections = [paths.home, paths.friends, paths.groups]

const findSectionIndex = (pathname: string) =>
  sections.findIndex((section) =>
    matchPath({ path: section, end: section === paths.home }, pathname),
  )

// Tells the page-focus hook not to pull focus to the page title: the shortcut places it itself.
export const keepFocusState = { keepFocus: true }

const postActions: Record<string, string> = { l: 'like', c: 'comments', r: 'reply', e: 'edit' }

const stepPost = (direction: 1 | -1) => {
  const posts = [...document.querySelectorAll<HTMLElement>('[data-post]')]
  if (posts.length === 0) {
    return
  }
  const current = posts.findIndex((post) => post.contains(document.activeElement))
  if (current === -1) {
    posts[direction === 1 ? 0 : posts.length - 1].focus()
    return
  }
  posts[Math.min(Math.max(current + direction, 0), posts.length - 1)].focus()
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

// Single-key shortcuts for the logged-in app. They stay out of the way while you type.
export const useNavigationShortcuts = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === '[' || event.key === ']') {
      const current = findSectionIndex(pathname)
      const step = event.key === ']' ? 1 : -1
      const next = current === -1 ? 0 : (current + step + sections.length) % sections.length
      navigate(sections[next], { state: keepFocusState })
      // Land keyboard focus on that section's sidebar link, so the ring shows where you went.
      document
        .querySelector<HTMLElement>(`nav[aria-label="Main"] a[href="${sections[next]}"]`)
        ?.focus()
      return
    }
    if (event.key === 'j' || event.key === 'k') {
      stepPost(event.key === 'j' ? 1 : -1)
      return
    }
    const postAction = postActions[event.key]
    if (postAction !== undefined) {
      const post = document.activeElement?.closest('[data-post]')
      const action = post?.querySelector<HTMLElement>(`[data-post-action="${postAction}"]`)
      if (action) {
        event.preventDefault()
        action.click()
        return
      }
    }
    if (event.key === '?') {
      setIsHelpOpen(true)
      return
    }
    // Any element can claim a key with data-shortcut: "/" opens search, "n" a new post.
    const claimant = document.querySelector<HTMLElement>(
      `[data-shortcut="${CSS.escape(event.key)}"]`,
    )
    if (claimant) {
      event.preventDefault()
      claimant.click()
    }
  })

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      // ⌘F / Ctrl+F jumps to the page's own search box. Pages without one keep the browser's find.
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f') {
        const pageSearch = document.querySelector<HTMLInputElement>('[data-page-search]')
        if (pageSearch) {
          event.preventDefault()
          pageSearch.focus()
          pageSearch.select()
        }
        return
      }
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) {
        return
      }
      handleKeyDown(event)
    }

    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
  }, [])

  const closeHelp = () => setIsHelpOpen(false)

  return { isHelpOpen, closeHelp }
}
