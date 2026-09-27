/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// Declaration merging with Vite's own ImportMetaEnv needs an interface, not a type.
interface ImportMetaEnv {
  readonly VITE_POCKETBASE_URL?: string
  // Cloudflare Turnstile on sign-up; unset (local development) shows no check.
  readonly VITE_TURNSTILE_SITE_KEY?: string
}
