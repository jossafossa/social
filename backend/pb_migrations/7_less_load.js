/// <reference path="../pb_data/types.d.ts" />

const thumbs = ["64x64", "192x192"]

migrate(
  (app) => {
    const posts = app.findCollectionByNameOrId("posts")
    // Kept in sync by pb_hooks/counters.pb.js, so a feed never has to load likes or comments to count them.
    posts.fields.add(new NumberField({ name: "likes", min: 0, onlyInt: true }))
    posts.fields.add(new NumberField({ name: "comments", min: 0, onlyInt: true }))
    const countersUntouched = "@request.body.likes:isset = false && @request.body.comments:isset = false"
    posts.createRule = `${posts.createRule} && ${countersUntouched}`
    posts.updateRule = `${posts.updateRule} && ${countersUntouched}`
    app.save(posts)

    app
      .db()
      .newQuery(
        "UPDATE posts SET " +
          "likes = (SELECT COUNT(*) FROM likes WHERE likes.post = posts.id), " +
          "comments = (SELECT COUNT(*) FROM comments WHERE comments.post = posts.id)",
      )
      .execute()

    const comments = app.findCollectionByNameOrId("comments")
    comments.indexes = ["CREATE INDEX idx_comments_post_created ON comments (post, created)"]
    app.save(comments)

    const users = app.findCollectionByNameOrId("users")
    users.fields.getByName("avatar").thumbs = thumbs
    app.save(users)

    const groups = app.findCollectionByNameOrId("groups")
    groups.fields.getByName("image").thumbs = thumbs
    app.save(groups)
  },
  (app) => {
    const posts = app.findCollectionByNameOrId("posts")
    posts.fields.removeByName("likes")
    posts.fields.removeByName("comments")
    const suffix = " && @request.body.likes:isset = false && @request.body.comments:isset = false"
    posts.createRule = posts.createRule.replace(suffix, "")
    posts.updateRule = posts.updateRule.replace(suffix, "")
    app.save(posts)

    const comments = app.findCollectionByNameOrId("comments")
    comments.indexes = ["CREATE INDEX idx_comments_post ON comments (post)"]
    app.save(comments)

    for (const [name, field] of [["users", "avatar"], ["groups", "image"]]) {
      const collection = app.findCollectionByNameOrId(name)
      collection.fields.getByName(field).thumbs = []
      app.save(collection)
    }
  },
)
