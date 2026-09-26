# PocketBase demo

Minimal PocketBase + React app: sign up, log in, edit bio, post, see posts and other users' bios.

## Run

```sh
# backend (http://127.0.0.1:8090, admin UI at /_/)
cd backend && ./pocketbase serve

# frontend (http://localhost:5173)
cd frontend && pnpm install && pnpm dev
```

Admin UI needs a superuser: `./pocketbase superuser upsert you@example.com yourpassword`.

## How it fits together

- `backend/pb_migrations/1_init.js` — the whole backend. Adds `bio` to the built-in `users`
  auth collection, creates `posts` (`author` → users, `content`, `created`), and sets API rules:
  logged-in users can list/view users and posts; you can only post as yourself. Migrations run
  automatically on `serve`; `pb_data/` holds the SQLite db.
- `backend/pb_migrations/5_social.js` — friends (a `friends` relation on users, one-way),
  `groups` + `memberships`, `likes`, `comments`, and indexes. Group posts need a membership.
- `backend/pb_hooks/counters.pb.js` — keeps `posts.likes` / `posts.comments` in sync (atomic
  `UPDATE … + 1`), so feeds never load likes or comments to count them. Clients can't set them.
- `frontend/src/api/` — PocketBase SDK client + RTK Query endpoints. Each endpoint wraps an SDK
  call in `queryFn`. Server-load rules: every list pages with `skipTotal`; `fields` trims other
  users' records (never their friends list); likes/comments/edits patch the cached post instead
  of refetching feeds; comments load only when opened; pictures load as `?thumb=` thumbnails.
- `frontend/src/router.tsx` — routes. `GuestLayout` (login/register) and `AppLayout` (everything
  else) double as auth guards.
- `frontend/src/components/` — reusable, unstyled UI. `features/` — forms wired to mutations.
  `pages/` — one per route.

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
- HTTPS, SPA fallback to `index.html`, backups of `backend/pb_data`.
- A short privacy note (you store EU users' email addresses).

## Deploy (Coolify + Cloudflare Tunnel)

One container: PocketBase serves the API and the built frontend (`pb_public`). Image ~60 MB,
~11 MB RAM idle. Local test: `docker build -t pocketbase-demo . && docker run -p 8090:8090 -v pb:/pb/pb_data pocketbase-demo`.

Coolify: new resource from the GitHub repo → build pack **Dockerfile** → port **8090** →
persistent storage at **`/pb/pb_data`** → don't publish the port; route the domain through
`cloudflared`. Auto-deploy on push is on by default with the GitHub App.

Make schema changes locally, where the dashboard writes them as files into `pb_migrations`. A
change in the production dashboard does alter the live database, but its migration file stays
inside the container and never reaches the repo.
