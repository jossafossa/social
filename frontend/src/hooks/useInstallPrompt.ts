import { useSyncExternalStore } from 'react'

// Chromium's install prompt: the browser offers it once, early, so it is caught when this module
// loads (before React renders) and kept until the person asks for it.
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type InstallStatus =
  // The browser can install it: show the button.
  | 'installable'
  // iPhone and iPad have no prompt; installing goes through Safari's share menu.
  | 'manual'
  | 'installed'
  // Anything else (Firefox desktop, already dismissed): nothing to offer.
  | 'unavailable'

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true

const isAppleMobile = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  // iPadOS reports itself as a Mac; the touch screen gives it away.
  (navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1)

const initialStatus = (): InstallStatus => {
  if (isStandalone()) {
    return 'installed'
  }
  return isAppleMobile() ? 'manual' : 'unavailable'
}

let deferredPrompt: InstallPromptEvent | undefined
let status = initialStatus()
const listeners = new Set<() => void>()

const setStatus = (next: InstallStatus) => {
  status = next
  listeners.forEach((listener) => listener())
}

window.addEventListener('beforeinstallprompt', (event) => {
  // Keep the browser's own mini bar away; the sidebar button offers it instead.
  event.preventDefault()
  deferredPrompt = event as InstallPromptEvent
  setStatus('installable')
})

window.addEventListener('appinstalled', () => {
  deferredPrompt = undefined
  setStatus('installed')
})

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => status

const install = async () => {
  if (!deferredPrompt) {
    return
  }
  await deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  // A prompt can only be used once; after a "no" the browser decides when to offer it again.
  deferredPrompt = undefined
  setStatus(outcome === 'accepted' ? 'installed' : 'unavailable')
}

export const useInstallPrompt = () => ({
  status: useSyncExternalStore(subscribe, getSnapshot),
  install,
})
