/// <reference path="../pb_data/types.d.ts" />

// Shared by spam.pb.js (hook handlers can't see each other's scope, so they require this). A new
// account (under a day old) gets tighter limits and no links: that is what throwaway spam accounts are.

const hour = 60 * 60 * 1000
const day = 24 * hour

const limits = {
  posts: { newAccount: 5, established: 30 },
  comments: { newAccount: 20, established: 120 },
}
const maxLinks = 5
const reportsToHide = 3

// PocketBase's own date format, so it compares as a plain string in SQL.
const toDbDate = (msAgo) => new Date(Date.now() - msAgo).toISOString().replace("T", " ")

const isNewAccount = (user) => user.getString("created") > toDbDate(day)

const countLinks = (content) => (content.match(/https?:\/\/|www\./gi) ?? []).length

const count = (app, sql, params) => {
  const result = new DynamicModel({ total: 0 })
  app.db().newQuery(`SELECT COUNT(*) AS total FROM ${sql}`).bind(params).one(result)
  return result.total
}

// The collection rules refuse these too, but only with "Failed to create record.", and they run
// before any record hook: this runs as router middleware, ahead of them.
const writePath = /^\/api\/collections\/(posts|comments|likes|memberships|groups|reports)\/records/

const checkCanWrite = (e) => {
  if (!writePath.test(e.request.url.path) || !e.auth || e.auth.collection().name !== "users") {
    return
  }
  if (!e.auth.getBool("verified")) {
    throw new ForbiddenError("Confirm your email address first: check your inbox for the link.")
  }
  if (e.auth.getBool("banned")) {
    throw new ForbiddenError("This account is suspended.")
  }
}

const checkLinks = (e) => {
  if (!e.auth || e.hasSuperuserAuth()) {
    return
  }
  const links = countLinks(e.record.getString("content"))
  if (links > 0 && isNewAccount(e.auth)) {
    throw new BadRequestError("New accounts can't post links during their first day.")
  }
  if (links > maxLinks) {
    throw new BadRequestError(`At most ${maxLinks} links per message.`)
  }
}

// `collection` is "posts" or "comments": both have author, content and created.
const checkMessage = (e, collection) => {
  checkLinks(e)
  if (!e.auth || e.hasSuperuserAuth()) {
    return
  }

  const { newAccount, established } = limits[collection]
  const limit = isNewAccount(e.auth) ? newAccount : established
  const recent = count(e.app, `${collection} WHERE author = {:author} AND created > {:since}`, {
    author: e.auth.id,
    since: toDbDate(hour),
  })
  if (recent >= limit) {
    const scope = limit === newAccount ? " during an account's first day" : ""
    throw new TooManyRequestsError(`Slow down: at most ${limit} ${collection} an hour${scope}.`)
  }

  // Posts repeat nowhere; a comment may ("thanks!"), just not twice on the same post.
  const sameThread = collection === "comments" ? " AND post = {:post}" : ""
  const duplicates = count(
    e.app,
    `${collection} WHERE author = {:author} AND content = {:content} AND created > {:since}${sameThread}`,
    { author: e.auth.id, content: e.record.getString("content"), since: toDbDate(day), post: e.record.getString("post") },
  )
  if (duplicates > 0) {
    throw new BadRequestError("You already posted this.")
  }
}

// Only accounts older than a day count, so a handful of fresh accounts can't hide someone's post.
const hideIfReported = (app, postId) => {
  const reports = count(
    app,
    "reports JOIN users ON users.id = reports.reporter WHERE reports.post = {:post} AND users.created < {:since}",
    { post: postId, since: toDbDate(day) },
  )
  if (reports >= reportsToHide) {
    app.db().newQuery("UPDATE posts SET hidden = TRUE WHERE id = {:post}").bind({ post: postId }).execute()
  }
}

const disposableDomains = () =>
  new Set(toString($os.readFile(`${__hooks}/disposable_domains.txt`)).split("\n").map((line) => line.trim()))

const checkEmail = (email) => {
  const domain = email.split("@").pop().toLowerCase()
  if (disposableDomains().has(domain)) {
    throw new BadRequestError("Use a permanent email address, not a disposable one.")
  }
}

// Cloudflare Turnstile. Off while TURNSTILE_SECRET_KEY is unset (local development).
const checkCaptcha = (e) => {
  const secret = $os.getenv("TURNSTILE_SECRET_KEY")
  if (secret === "") {
    return
  }
  const token = e.requestInfo().body.turnstileToken
  const response = $http.send({
    url: "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ secret, response: typeof token === "string" ? token : "", remoteip: e.realIP() }),
    timeout: 10,
  })
  if (response.statusCode !== 200 || response.json?.success !== true) {
    throw new BadRequestError("The human check failed. Try again.")
  }
}

module.exports = { checkCanWrite, checkLinks, checkMessage, hideIfReported, checkEmail, checkCaptcha }
