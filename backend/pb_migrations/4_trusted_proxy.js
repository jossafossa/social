/// <reference path="../pb_data/types.d.ts" />

// All traffic arrives through Cloudflare Tunnel, so the socket IP is the tunnel's. Without this,
// every visitor shares one rate-limit bucket. Only safe while PocketBase is unreachable except
// through Cloudflare: anyone hitting it directly could forge this header.
migrate(
  (app) => {
    const settings = app.settings()
    settings.trustedProxy.headers = ["CF-Connecting-IP"]
    settings.trustedProxy.useLeftmostIP = false
    app.save(settings)
  },
  (app) => {
    const settings = app.settings()
    settings.trustedProxy.headers = []
    app.save(settings)
  },
)
