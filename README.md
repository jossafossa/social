# PocketBase demo

PocketBase + React social app: friends, groups, posts, likes and comments, with markdown, feeds
sorted by likes, comments or date, a read-only guest mode, light/dark themes, a mobile layout and an
installable PWA that updates itself.

## Run

Prerequisites: Node + pnpm, the `pocketbase` binary in `backend/`, and
[Mailpit](https://mailpit.axllent.org) for email (`brew install mailpit`; optional).

```sh
cd frontend && pnpm install && pnpm dev
```

`pnpm dev` (`frontend/scripts/dev.mjs`) starts everything, and Ctrl+C (or closing the terminal)
stops everything:

| What          | Where                                                  |
| ------------- | ------------------------------------------------------ |
| App (Vite)    | http://localhost:5173                                  |
| PocketBase    | http://127.0.0.1:8090, admin UI at `/_/`               |
| Mailpit       | http://localhost:8025: every email lands here          |
| Email preview | http://localhost:3030: the React Email templates, live |

Nothing is really sent: PocketBase mails Mailpit, and the links in those emails open the dev app
(`backend/pb_hooks/dev_mail.pb.js`, in memory only, so the database's own mail settings stay).
Without Mailpit installed the app still runs; emails just aren't caught. Don't also run
`./pocketbase serve` yourself: port 8090 is taken and `pnpm dev` stops.

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
- `backend/pb_migrations/9_anti_spam.js` + `backend/pb_hooks/spam.pb.js` — spam and trolls (see
  Moderation).
- `backend/pb_migrations/10_app_email_links.js` — confirmation and password reset emails link to
  the app (`/confirm-email/…`, `/reset-password/…`), not the admin UI, which can stay behind
  Cloudflare Zero Trust.
- `frontend/emails/` — the emails (confirm email, reset password, new-login alert) as React Email
  components in the site's style. `pnpm emails` renders them to `backend/pb_hooks/emails/*.html`
  (committed); `backend/pb_hooks/email_templates.pb.js` copies those into PocketBase on every
  start, so they win over edits in the admin UI. `pnpm dev` previews them live and re-renders
  on save; Mailpit shows the ones really sent.
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
- Admin UI → Settings → Mail: configure **SMTP**, or password reset and confirmation emails won't
  arrive, and nobody who signs up can post.
- Cloudflare Turnstile (dashboard → Turnstile → add widget for your domain): set the site key as
  the Coolify **build variable** `VITE_TURNSTILE_SITE_KEY` and the secret key as the runtime
  variable `TURNSTILE_SECRET_KEY`. Without both, signup has no human check.
- Cloudflare dashboard: turn on **Bot Fight Mode**.
- Trusted proxy header `CF-Connecting-IP` is set by `backend/pb_migrations/4_trusted_proxy.js`
  (Cloudflare Tunnel). Never expose port 8090 publicly: the header is only trustworthy when
  every request comes through Cloudflare.
- Admin UI → Settings → Backups: schedule backups of the database (ideally to S3).
- A short privacy note (you store EU users' email addresses).

## Moderation

- Signup: Turnstile human check, no disposable email domains (`backend/pb_hooks/disposable_domains.txt`,
  from github.com/disposable-email-domains), at most 5 signups per IP an hour.
- Writing (posts, comments, likes, groups, reports) needs a confirmed email. Accounts made before
  this was added were marked confirmed.
- Per account: in its first day 5 posts and 20 comments an hour and no links; after that 30 posts,
  120 comments and 5 links per message. The same post twice in a day is refused.
- **Ban** someone: admin UI → users → tick `banned`. Their profile, posts and comments disappear
  for everyone but themselves, and they can't write. Untick to undo.
- **Reports**: 3 reports from accounts older than a day set the post's `hidden`, so only its author
  still sees it. Review in admin UI → reports (or posts, filter `hidden = true`): untick `hidden`
  to restore the post, or ban the author.

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
