/// <reference path="../pb_data/types.d.ts" />

// Local development only: `pnpm dev` (frontend/scripts/dev.mjs) sets these, so email goes to
// Mailpit and its links open the Vite dev server. Changed in memory, never saved: the database
// keeps its own settings, and without the variables (production) this does nothing.
onBootstrap((e) => {
  e.next()
  const smtpPort = $os.getenv("DEV_MAILPIT_SMTP_PORT")
  if (smtpPort === "") {
    return
  }
  const settings = e.app.settings()
  Object.assign(settings.smtp, {
    enabled: true,
    host: "127.0.0.1",
    port: Number(smtpPort),
    username: "",
    password: "",
    tls: false,
  })
  settings.meta.appURL = $os.getenv("DEV_APP_URL")
})
