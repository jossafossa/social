/// <reference path="../pb_data/types.d.ts" />

// The users' emails come from frontend/emails (React Email): `pnpm emails` renders them into
// pb_hooks/emails, and every start copies them into the collection. So these files win over edits
// in the admin UI; change the React components instead.
onBootstrap((e) => {
  e.next()

  const templates = [
    ["verificationTemplate", "verification.html", "confirm your email · pb/social"],
    ["resetPasswordTemplate", "reset-password.html", "choose a new password · pb/social"],
    ["authAlert.emailTemplate", "auth-alert.html", "new login to your account · pb/social"],
  ]

  const users = e.app.findCollectionByNameOrId("users")
  let isChanged = false
  for (const [path, file, subject] of templates) {
    const template = path.split(".").reduce((parent, key) => parent[key], users)
    let body
    try {
      body = toString($os.readFile(`${__hooks}/emails/${file}`))
    } catch {
      // `pnpm emails` rewrites the folder, and PocketBase restarts mid-way: keep what's there.
      e.app.logger().warn("Email template missing, keeping the current one", "file", file)
      continue
    }
    if (template.body !== body || template.subject !== subject) {
      template.body = body
      template.subject = subject
      isChanged = true
    }
  }
  if (isChanged) {
    e.app.save(users)
  }
})
