/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const posts = app.findCollectionByNameOrId("posts")
    posts.updateRule = "author = @request.auth.id && @request.body.author:isset = false"
    app.save(posts)
  },
  (app) => {
    const posts = app.findCollectionByNameOrId("posts")
    posts.updateRule = null
    app.save(posts)
  },
)
