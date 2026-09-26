/// <reference path="../pb_data/types.d.ts" />

// Counters on posts, updated with one atomic UPDATE so concurrent likes can't overwrite each other.
// PocketBase runs each handler in isolation, so nothing can be shared between them.

onRecordAfterCreateSuccess((e) => {
  e.app.db().newQuery("UPDATE posts SET likes = likes + 1 WHERE id = {:id}").bind({ id: e.record.get("post") }).execute()
  e.next()
}, "likes")

onRecordAfterDeleteSuccess((e) => {
  e.app.db().newQuery("UPDATE posts SET likes = MAX(likes - 1, 0) WHERE id = {:id}").bind({ id: e.record.get("post") }).execute()
  e.next()
}, "likes")

onRecordAfterCreateSuccess((e) => {
  e.app.db().newQuery("UPDATE posts SET comments = comments + 1 WHERE id = {:id}").bind({ id: e.record.get("post") }).execute()
  e.next()
}, "comments")

onRecordAfterDeleteSuccess((e) => {
  e.app.db().newQuery("UPDATE posts SET comments = MAX(comments - 1, 0) WHERE id = {:id}").bind({ id: e.record.get("post") }).execute()
  e.next()
}, "comments")
