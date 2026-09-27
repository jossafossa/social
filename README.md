# PocketBase demo

PocketBase + React social app: friends, groups, posts, likes and comments, with markdown, feeds
sorted by likes, comments or date, a read-only guest mode, light/dark themes, a mobile layout and an
installable PWA that updates itself.

## Run

```sh
# backend (http://127.0.0.1:8090, admin UI at /_/)
cd backend && ./pocketbase serve

# frontend (http://localhost:5173)
cd frontend && pnpm install && pnpm dev
```

Admin UI needs a superuser: `./pocketbase superuser upsert you@example.com yourpassword`.

Stress-test data (local only): `./pocketbase seed [scale] --hooksDir=pb_seed`, remove with
`./pocketbase seed clean --hooksDir=pb_seed`. Seeded users log in as `user1@seed.test` … with
`password123`.

## How it fits together

- `backend/pb_migrations/1_init.js` — the whole backend. Adds `bio` to the built-in `users`
  auth collection and creates `posts` (`author` → users, `content`, `created`). Migrations run
  automatically on `serve`; `pb_data/` holds the SQLite db.
- `backend/pb_migrations/5_social.js` — friends (a `friends` relation on users, one-way),
  `groups` + `memberships`, `likes`, `comments`, and indexes. Group posts need a membership.
- `backend/pb_migrations/8_public_read.js` — anyone may read (guest mode); only logged-in users
  write, and only as themselves. Emails stay private.
- `backend/pb_hooks/counters.pb.js` — keeps `posts.likes` / `posts.comments` in sync (atomic
  `UPDATE … + 1`), so feeds never load likes or comments to count them. Clients can't set them.
- `backend/pb_hooks/line_endings.pb.js` — stores bios with `\n` line breaks when a save includes a
  file (multipart sends `\r\n`, which broke the length limit).
- `backend/pb_hooks/static_assets.pb.js` — cache headers for the built frontend (see Caching).
- `frontend/src/api/` — PocketBase SDK client + RTK Query endpoints. Each endpoint wraps an SDK
  call in `queryFn`. Server-load rules: every list pages with `skipTotal`; `fields` trims other
  users' records (never their friends list); likes/comments/edits patch the cached post instead
  of refetching feeds; comments load only when opened; pictures load as `?thumb=` thumbnails.
- `frontend/src/router.tsx` — routes. `GuestLayout` (login/register) sends members home;
  `MembersOnly` guards settings and creating a group. Everything else is readable as a guest.
- `frontend/src/components/` — reusable UI. `features/` — components wired to the API.
  `pages/` — one per route. Code style: `.claude/coding-style.md`.

## Configuration

- `VITE_POCKETBASE_URL` — PocketBase address. Set to `http://127.0.0.1:8090` in
  `frontend/.env.development`; unset in production, where it defaults to the page's own origin
  (serve `frontend/dist` from `backend/pb_public`).
- Rate limiting is enabled by `backend/pb_migrations/2_rate_limits.js` (login 5 / 10s,
  creates 20 / 5s, everything else 300 / 10s, per IP).

## Before going live (settings, no code)

- Create a superuser: `./pocketbase superuser upsert EMAIL PASS`.
- Admin UI → Settings → Application: set the public **App URL** (used in email links).
- Admin UI → Settings → Mail: configure **SMTP**, or password reset emails won't arrive.
- Trusted proxy header `CF-Connecting-IP` is set by `backend/pb_migrations/4_trusted_proxy.js`
  (Cloudflare Tunnel). Never expose port 8090 publicly: the header is only trustworthy when
  every request comes through Cloudflare.
- Admin UI → Settings → Backups: schedule backups of the database (ideally to S3).
- A short privacy note (you store EU users' email addresses).

## Deploy (Coolify + Cloudflare Tunnel)

One container: PocketBase serves the API and the built frontend (`pb_public`), on one origin, so no
CORS setup. Image ~60 MB, ~11 MB RAM idle. Local test:
`docker build -t pocketbase-demo . && docker run -p 8090:8090 -v pb:/pb/pb_data pocketbase-demo`.

Coolify: new resource from the GitHub repo → build pack **Dockerfile** → port **8090** →
persistent storage at **`/pb/pb_data`** → don't publish the port; route the domain through
`cloudflared`. Auto-deploy on push is on by default with the GitHub App. One replica only (SQLite).

## Caching

The server's headers decide everything (`backend/pb_hooks/static_assets.pb.js`); Cloudflare and
browsers follow them:

| Path | `Cache-Control` | Why |
| --- | --- | --- |
| `/assets/*` | `public, max-age=31536000, immutable` | named by content hash, never stale |
| missing `/assets/*` | `no-store`, 404 | a request that reaches the old container mid-deploy is never remembered |
| pages, `/sw.js`, manifest, icons | `no-cache` | checked on every load (a cheap 304), so deploys arrive at once |
| `/api/*` | none | live data; Cloudflare never caches it |

Cloudflare needs no Cache Rules: only Caching → Configuration → **Browser Cache TTL → Respect
Existing Headers**. Don't enable "Cache Everything" and don't edge-cache HTML or `/api/`. Keep
"Always Online" off.

The service worker (`vite-plugin-pwa`, `frontend/vite.config.ts`) precaches the app for returning
visitors and installed apps. A deploy's new worker takes over and reloads the page; open apps check
hourly. `pnpm dev` doesn't register it.

Make schema changes locally, where the dashboard writes them as files into `pb_migrations`. A
change in the production dashboard does alter the live database, but its migration file stays
inside the container and never reaches the repo.
