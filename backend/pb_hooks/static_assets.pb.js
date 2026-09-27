/// <reference path="../pb_data/types.d.ts" />

// Cache headers for the built frontend in pb_public (next to pb_hooks, see the Dockerfile; locally
// there is none, Vite serves the app). Cloudflare and browsers follow these, so:
//
// - /assets/* is named by content hash: cached for a year, never stale.
// - A missing /assets/* file is a 404 that nothing may keep. The public-dir fallback would answer
//   with index.html instead: during a deploy a request for the new build's CSS can reach the old
//   container, and that HTML then got cached as the stylesheet and broke the site.
// - Everything else outside the API (pages, sw.js, the manifest, icons) is checked on every load, so
//   a deploy arrives at once; an unchanged file is a cheap 304.

routerAdd("GET", "/assets/{path...}", (e) => {
  const assetsDir = `${__hooks}/../pb_public/assets`
  const path = e.request.pathValue("path")

  let isFile = false
  if (!path.includes("..")) {
    try {
      isFile = !$os.stat(`${assetsDir}/${path}`).isDir()
    } catch {
      // Not there.
    }
  }
  if (!isFile) {
    e.response.header().set("Cache-Control", "no-store")
    throw new NotFoundError("Not found.")
  }

  e.response.header().set("Cache-Control", "public, max-age=31536000, immutable")
  return $apis.static($os.dirFS(assetsDir), false)(e)
})

routerUse((e) => {
  const path = e.request.url.path
  const isFrontend =
    e.request.method === "GET" &&
    !path.startsWith("/api/") &&
    !path.startsWith("/_/") &&
    !path.startsWith("/assets/")
  if (isFrontend) {
    e.response.header().set("Cache-Control", "no-cache")
    if (path === "/manifest.webmanifest") {
      e.response.header().set("Content-Type", "application/manifest+json")
    }
  }
  return e.next()
})
