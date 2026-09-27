/// <reference path="../pb_data/types.d.ts" />

// Spam and trolls. Writing needs a confirmed email and an account that isn't banned (pb_hooks/spam.pb.js
// adds the per-account limits and explains a refusal; these rules are what actually holds). Banning
// someone (`banned` in the admin UI) hides their profile, posts and comments from everyone but
// themselves. Reports hide a post once enough established accounts flag it; unhide it with `hidden`.
const canWrite = "@request.auth.verified = true && @request.auth.banned = false"
const writeCollections = ["posts", "comments", "likes", "memberships", "groups"]
const notBanned = "@request.body.banned:isset = false"
const notHidden = "@request.body.hidden:isset = false"

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users")
    users.fields.add(new BoolField({ name: "banned" }))
    users.createRule = notBanned
    users.updateRule = `${users.updateRule} && ${notBanned}`
    users.listRule = "banned = false || id = @request.auth.id"
    users.viewRule = users.listRule
    app.save(users)

    for (const name of writeCollections) {
      const collection = app.findCollectionByNameOrId(name)
      collection.createRule = `${canWrite} && ${collection.createRule}`
      app.save(collection)
    }

    const groups = app.findCollectionByNameOrId("groups")
    groups.updateRule = `${canWrite} && ${groups.updateRule}`
    app.save(groups)

    const posts = app.findCollectionByNameOrId("posts")
    posts.fields.add(new BoolField({ name: "hidden" }))
    posts.createRule = `${posts.createRule} && ${notHidden}`
    posts.updateRule = `@request.auth.banned = false && ${posts.updateRule} && ${notHidden}`
    posts.listRule = "(hidden = false && author.banned = false) || author = @request.auth.id"
    posts.viewRule = posts.listRule
    app.save(posts)

    const comments = app.findCollectionByNameOrId("comments")
    comments.listRule = "author.banned = false || author = @request.auth.id"
    comments.viewRule = comments.listRule
    app.save(comments)

    const reports = new Collection({
      type: "base",
      name: "reports",
      listRule: "reporter = @request.auth.id",
      viewRule: "reporter = @request.auth.id",
      createRule:
        `${canWrite} && @request.body.reporter = @request.auth.id && ` +
        "@request.body.post.author != @request.auth.id",
      fields: [
        { type: "relation", name: "reporter", required: true, collectionId: users.id, maxSelect: 1, cascadeDelete: true },
        { type: "relation", name: "post", required: true, collectionId: posts.id, maxSelect: 1, cascadeDelete: true },
        { type: "autodate", name: "created", onCreate: true },
      ],
      indexes: [
        "CREATE UNIQUE INDEX idx_reports_post_reporter ON reports (post, reporter)",
        "CREATE INDEX idx_reports_created ON reports (created)",
      ],
    })
    app.save(reports)

    // The accounts made before email confirmation was required keep writing.
    app.db().newQuery("UPDATE users SET verified = TRUE").execute()

    // Each of these sends an email: without a limit they flood someone's inbox from a script.
    const settings = app.settings()
    settings.rateLimits.rules = [
      ...settings.rateLimits.rules,
      { label: "users:create", maxRequests: 5, duration: 3600 },
      { label: "*:requestVerification", maxRequests: 3, duration: 600 },
      { label: "*:requestPasswordReset", maxRequests: 3, duration: 600 },
    ]
    app.save(settings)
  },
  (app) => {
    const settings = app.settings()
    const emailLabels = ["users:create", "*:requestVerification", "*:requestPasswordReset"]
    settings.rateLimits.rules = settings.rateLimits.rules.filter(({ label }) => !emailLabels.includes(label))
    app.save(settings)

    app.delete(app.findCollectionByNameOrId("reports"))

    const comments = app.findCollectionByNameOrId("comments")
    comments.listRule = ""
    comments.viewRule = ""
    app.save(comments)

    const posts = app.findCollectionByNameOrId("posts")
    posts.fields.removeByName("hidden")
    posts.listRule = ""
    posts.viewRule = ""
    posts.createRule = posts.createRule.replace(` && ${notHidden}`, "")
    posts.updateRule = posts.updateRule.replace("@request.auth.banned = false && ", "").replace(` && ${notHidden}`, "")
    app.save(posts)

    const groups = app.findCollectionByNameOrId("groups")
    groups.updateRule = groups.updateRule.replace(`${canWrite} && `, "")
    app.save(groups)

    for (const name of writeCollections) {
      const collection = app.findCollectionByNameOrId(name)
      collection.createRule = collection.createRule.replace(`${canWrite} && `, "")
      app.save(collection)
    }

    const users = app.findCollectionByNameOrId("users")
    users.fields.removeByName("banned")
    users.createRule = ""
    users.updateRule = users.updateRule.replace(` && ${notBanned}`, "")
    users.listRule = ""
    users.viewRule = ""
    app.save(users)
  },
)
