/// <reference path="../pb_data/types.d.ts" />

const isLoggedIn = "@request.auth.id != ''"

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users")
    users.fields.add(new TextField({ name: "bio", max: 500 }))
    users.listRule = isLoggedIn
    users.viewRule = isLoggedIn
    app.save(users)

    const posts = new Collection({
      type: "base",
      name: "posts",
      listRule: isLoggedIn,
      viewRule: isLoggedIn,
      createRule: `${isLoggedIn} && @request.body.author = @request.auth.id`,
      fields: [
        { type: "relation", name: "author", required: true, collectionId: users.id, maxSelect: 1, cascadeDelete: true },
        { type: "text", name: "content", required: true, max: 1000 },
        { type: "autodate", name: "created", onCreate: true },
      ],
    })
    app.save(posts)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId("posts"))

    const users = app.findCollectionByNameOrId("users")
    users.fields.removeByName("bio")
    users.listRule = "id = @request.auth.id"
    users.viewRule = "id = @request.auth.id"
    app.save(users)
  },
)
