/// <reference path="../pb_data/types.d.ts" />

// Signup is public, so login and signup must not be open to brute force or spam.
migrate(
  (app) => {
    const settings = app.settings()
    settings.rateLimits.enabled = true
    settings.rateLimits.rules = [
      { label: "*:auth", maxRequests: 5, duration: 10 },
      { label: "*:create", maxRequests: 20, duration: 5 },
      { label: "/api/", maxRequests: 300, duration: 10 },
    ]
    app.save(settings)
  },
  (app) => {
    const settings = app.settings()
    settings.rateLimits.enabled = false
    app.save(settings)
  },
)
