/// <reference path="../pb_data/types.d.ts" />

// Spam limits (see spam.js). The collection rules from pb_migrations/9_anti_spam.js stay the
// guarantee; these add per-account limits and say why a write was refused.

// Every request passes here, so only writes load spam.js.
routerUse((e) => {
  if (e.request.method === "POST" || e.request.method === "PATCH") {
    require(`${__hooks}/spam.js`).checkCanWrite(e)
  }
  return e.next()
})

onRecordCreateRequest((e) => {
  const spam = require(`${__hooks}/spam.js`)
  if (!e.hasSuperuserAuth()) {
    spam.checkEmail(e.record.getString("email"))
    spam.checkCaptcha(e)
  }
  e.next()

  // A failed email (no SMTP yet) mustn't fail the signup: the app offers to send it again.
  if (!e.record.getBool("verified")) {
    try {
      $mails.sendRecordVerification(e.app, e.record)
    } catch (error) {
      e.app.logger().error("Verification email not sent", "error", error, "user", e.record.id)
    }
  }
}, "users")

onRecordCreateRequest((e) => {
  require(`${__hooks}/spam.js`).checkMessage(e, "posts")
  e.next()
}, "posts")

// Edits could add the links a new account can't post.
onRecordUpdateRequest((e) => {
  require(`${__hooks}/spam.js`).checkLinks(e)
  e.next()
}, "posts")

onRecordCreateRequest((e) => {
  require(`${__hooks}/spam.js`).checkMessage(e, "comments")
  e.next()
}, "comments")

// Instead of the unique index's "post: Value must be unique.".
onRecordCreateRequest((e) => {
  const reports = e.app.countRecords("reports", $dbx.hashExp({ post: e.record.getString("post"), reporter: e.record.getString("reporter") }))
  if (reports > 0) {
    throw new BadRequestError("You already reported this post.")
  }
  e.next()
}, "reports")

onRecordAfterCreateSuccess((e) => {
  require(`${__hooks}/spam.js`).hideIfReported(e.app, e.record.getString("post"))
  e.next()
}, "reports")
