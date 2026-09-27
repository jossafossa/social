import { registerSW } from 'virtual:pwa-register'

const updateCheckInterval = 60 * 60 * 1000

// Auto-update (vite.config.ts): once a newer build's service worker is ready it takes over and the
// page reloads onto it. An installed app can stay open for days, so ask the server hourly as well as
// on every load.
export const registerServiceWorker = () =>
  registerSW({
    immediate: true,
    onRegisteredSW: (_url, registration) => {
      if (registration) {
        setInterval(() => registration.update(), updateCheckInterval)
      }
    },
  })
