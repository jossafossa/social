/// <reference path="../pb_data/types.d.ts" />

// Read-only mode for visitors: anyone may read, only logged-in users may write (create, update and
// delete rules are unchanged). Emails stay private through the users' emailVisibility.
const collections = ["users", "posts", "groups", "memberships", "likes", "comments"]
const isLoggedIn = "@request.auth.id != ''"

migrate(
  (app) => {
    for (const name of collections) {
      const collection = app.findCollectionByNameOrId(name)
      collection.listRule = ""
      collection.viewRule = ""
      app.save(collection)
    }
  },
  (app) => {
    for (const name of collections) {
      const collection = app.findCollectionByNameOrId(name)
      collection.listRule = isLoggedIn
      collection.viewRule = isLoggedIn
      app.save(collection)
    }
  },
)
