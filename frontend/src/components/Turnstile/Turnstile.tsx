import { useEffect, useEffectEvent, useRef } from 'react'
import fieldStyles from '~/styles/field.module.scss'
import styles from './Turnstile.module.scss'

type TurnstileTheme = 'light' | 'dark' | 'auto'

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      theme: TurnstileTheme
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': () => void
    },
  ) => string
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

type TurnstileProps = {
  siteKey: string
  // The token, or '' once it expires or the check fails.
  onChange: (token: string) => void
  theme?: TurnstileTheme
  error?: string
}

let turnstilePromise: Promise<TurnstileApi> | undefined

// One script for every widget; a failed load (offline, a blocker) may be retried by the next one.
const loadTurnstile = () => {
  turnstilePromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onload = () => {
      if (window.turnstile) {
        resolve(window.turnstile)
      }
    }
    script.onerror = () => {
      turnstilePromise = undefined
      script.remove()
      reject(new Error('Turnstile failed to load'))
    }
    document.head.append(script)
  })
  return turnstilePromise
}

// Cloudflare's human check. A token works once: remount (change `key`) after a failed submit.
export const Turnstile = ({ siteKey, onChange, theme = 'auto', error }: TurnstileProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const handleChange = useEffectEvent(onChange)

  useEffect(() => {
    let widgetId: string | undefined
    let isCancelled = false
    loadTurnstile()
      .then((turnstile) => {
        if (isCancelled || !containerRef.current) {
          return
        }
        widgetId = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          callback: (token) => handleChange(token),
          'expired-callback': () => handleChange(''),
          'error-callback': () => handleChange(''),
        })
      })
      .catch(() => {
        // Nothing to show: submitting without a token explains it through `error`.
      })
    return () => {
      isCancelled = true
      if (widgetId !== undefined) {
        window.turnstile?.remove(widgetId)
      }
    }
  }, [siteKey, theme])

  return (
    <div className={styles.turnstile}>
      <div ref={containerRef} className={styles.widget} />
      {error && (
        <span role="alert" className={fieldStyles.error}>
          {error}
        </span>
      )}
    </div>
  )
}
