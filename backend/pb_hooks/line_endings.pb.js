/// <reference path="../pb_data/types.d.ts" />

// Multipart bodies (any save that includes a file) send line breaks as \r\n, so a 500-character bio
// arrives as 500 + its line count and fails the max-length check. Store plain \n, as JSON saves do.

onRecordCreateRequest((e) => {
  for (const field of ["bio"]) {
    e.record.set(field, e.record.getString(field).replaceAll("\r\n", "\n"))
  }
  e.next()
}, "users")

onRecordUpdateRequest((e) => {
  for (const field of ["bio"]) {
    e.record.set(field, e.record.getString(field).replaceAll("\r\n", "\n"))
  }
  e.next()
}, "users")
