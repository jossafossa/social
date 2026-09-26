/// <reference path="../pb_data/types.d.ts" />

// The frontend shrinks pictures before upload; this cap stops anyone bypassing it via the API.
// No SVG: it can carry scripts.
const pictureRules = { maxSelect: 1, maxSize: 1024 * 1024, mimeTypes: ["image/jpeg", "image/png", "image/webp"] }

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users")
    Object.assign(users.fields.getByName("avatar"), pictureRules)
    app.save(users)

    const groups = app.findCollectionByNameOrId("groups")
    groups.fields.add(new FileField({ name: "image", ...pictureRules }))
    // Members may change the picture, not the name.
    groups.updateRule = "memberships_via_group.user ?= @request.auth.id && @request.body.name:isset = false"
    app.save(groups)
  },
  (app) => {
    const groups = app.findCollectionByNameOrId("groups")
    groups.fields.removeByName("image")
    groups.updateRule = null
    app.save(groups)

    const users = app.findCollectionByNameOrId("users")
    Object.assign(users.fields.getByName("avatar"), {
      maxSize: 0,
      mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"],
    })
    app.save(users)
  },
)
