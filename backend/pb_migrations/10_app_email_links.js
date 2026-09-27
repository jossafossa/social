/// <reference path="../pb_data/types.d.ts" />

// The confirmation and password reset emails link to the app instead of the admin UI's pages, which
// sit behind Cloudflare Zero Trust. Only the link changes, so edits made to the templates stay.
const links = [
  ["verificationTemplate", "{APP_URL}/_/#/auth/confirm-verification/{TOKEN}", "{APP_URL}/confirm-email/{TOKEN}"],
  ["resetPasswordTemplate", "{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}", "{APP_URL}/reset-password/{TOKEN}"],
]

const relink = (app, isForward) => {
  const users = app.findCollectionByNameOrId("users")
  for (const [template, adminLink, appLink] of links) {
    const [from, to] = isForward ? [adminLink, appLink] : [appLink, adminLink]
    users[template].body = users[template].body.replaceAll(from, to)
  }
  app.save(users)
}

migrate(
  (app) => relink(app, true),
  (app) => relink(app, false),
)
