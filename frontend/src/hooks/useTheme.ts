import { useSyncExternalStore } from 'react'

export const themes = ['light', 'dark', 'device'] as const
export type Theme = (typeof themes)[number]

// Kept in this browser. index.html reads the same key before the first paint, so a dark page never
// flashes light while the app loads; keep the two in step.
const storageKey = 'theme'
const listeners = new Set<() => void>()

const read = (): Theme => {
  try {
    return themes.find((theme) => theme === localStorage.getItem(storageKey)) ?? 'device'
  } catch {
    return 'device'
  }
}

let current = read()

// "device" leaves the attribute off, so the CSS follows prefers-color-scheme.
const apply = (theme: Theme) => {
  if (theme === 'device') {
    delete document.documentElement.dataset.theme
  } else {
    document.documentElement.dataset.theme = theme
  }
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => current

const setTheme = (theme: Theme) => {
  current = theme
  apply(theme)
  try {
    if (theme === 'device') {
      localStorage.removeItem(storageKey)
    } else {
      localStorage.setItem(storageKey, theme)
    }
  } catch {
    // Blocked storage: the choice lasts until the tab closes.
  }
  listeners.forEach((listener) => listener())
}

export const useTheme = () => ({ theme: useSyncExternalStore(subscribe, getSnapshot), setTheme })
