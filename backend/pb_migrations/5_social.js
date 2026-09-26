/// <reference path="../pb_data/types.d.ts" />

const isLoggedIn = "@request.auth.id != ''"

const relation = (name, collectionId) => ({
  type: "relation",
  name,
  collectionId,
  required: true,
  maxSelect: 1,
  cascadeDelete: true,
})

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users")
    users.fields.add(new RelationField({ name: "friends", collectionId: users.id, maxSelect: 999 }))
    app.save(users)

    const groups = new Collection({
      type: "base",
      name: "groups",
      listRule: isLoggedIn,
      viewRule: isLoggedIn,
      createRule: isLoggedIn,
      fields: [{ type: "text", name: "name", required: true, max: 100 }],
    })
    app.save(groups)

    const memberships = new Collection({
      type: "base",
      name: "memberships",
      listRule: isLoggedIn,
      viewRule: isLoggedIn,
      createRule: "@request.body.user = @request.auth.id",
      deleteRule: "user = @request.auth.id",
      fields: [relation("user", users.id), relation("group", groups.id)],
      indexes: ["CREATE UNIQUE INDEX idx_memberships_user_group ON memberships (user, `group`)"],
    })
    app.save(memberships)

    const posts = app.findCollectionByNameOrId("posts")
    posts.fields.add(
      new RelationField({ name: "group", collectionId: groups.id, maxSelect: 1, cascadeDelete: true }),
    )
    // Group posts are for members only.
    posts.createRule =
      "@request.body.author = @request.auth.id && (@request.body.group = '' || " +
      "@request.body.group.memberships_via_group.user ?= @request.auth.id)"
    posts.updateRule =
      "author = @request.auth.id && @request.body.author:isset = false && @request.body.group:isset = false"
    posts.indexes = [
      "CREATE INDEX idx_posts_created ON posts (created)",
      "CREATE INDEX idx_posts_author ON posts (author)",
      "CREATE INDEX idx_posts_group ON posts (`group`)",
    ]
    app.save(posts)

    const likes = new Collection({
      type: "base",
      name: "likes",
      listRule: isLoggedIn,
      viewRule: isLoggedIn,
      createRule: "@request.body.user = @request.auth.id",
      deleteRule: "user = @request.auth.id",
      fields: [relation("post", posts.id), relation("user", users.id)],
      indexes: ["CREATE UNIQUE INDEX idx_likes_post_user ON likes (post, user)"],
    })
    app.save(likes)

    const comments = new Collection({
      type: "base",
      name: "comments",
      listRule: isLoggedIn,
      viewRule: isLoggedIn,
      createRule: "@request.body.author = @request.auth.id",
      fields: [
        relation("post", posts.id),
        relation("author", users.id),
        { type: "text", name: "content", required: true, max: 1000 },
        { type: "autodate", name: "created", onCreate: true },
      ],
      indexes: ["CREATE INDEX idx_comments_post ON comments (post)"],
    })
    app.save(comments)
  },
  (app) => {
    for (const name of ["comments", "likes", "memberships"]) {
      app.delete(app.findCollectionByNameOrId(name))
    }
    const posts = app.findCollectionByNameOrId("posts")
    posts.fields.removeByName("group")
    posts.indexes = []
    posts.createRule = "@request.auth.id != '' && @request.body.author = @request.auth.id"
    posts.updateRule = "author = @request.auth.id && @request.body.author:isset = false"
    app.save(posts)
    app.delete(app.findCollectionByNameOrId("groups"))

    const users = app.findCollectionByNameOrId("users")
    users.fields.removeByName("friends")
    app.save(users)
  },
)
