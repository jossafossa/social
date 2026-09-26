const platform =
  typeof navigator === 'undefined'
    ? ''
    : ((navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData
        ?.platform ?? navigator.userAgent)

export const isMac = /mac|iphone|ipad/i.test(platform)

// The keys each hint shows, and what aria-keyshortcuts announces. Only macOS uses ⌘; Windows and
// Linux use Ctrl.
export const submitShortcut = {
  keys: isMac ? ['⌘', '↵'] : ['Ctrl', 'Enter'],
  aria: isMac ? 'Meta+Enter' : 'Control+Enter',
}

export const cancelShortcut = { keys: ['Esc'], aria: 'Escape' }

export const findShortcut = {
  keys: isMac ? ['⌘', 'F'] : ['Ctrl', 'F'],
  aria: isMac ? 'Meta+F' : 'Control+F',
}
