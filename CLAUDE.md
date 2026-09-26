# pocketbase-demo

Learning project: PocketBase backend (`backend/`) + Vite/React 19/TS/RTK Query/React Router
frontend (`frontend/`). Code style: [`.claude/coding-style.md`](.claude/coding-style.md).

## Commands (in `frontend/`, pnpm only)

| Task      | Command          |
| --------- | ---------------- |
| Dev       | `pnpm dev`       |
| Typecheck | `pnpm typecheck` |
| Lint      | `pnpm lint`      |
| Format    | `pnpm format`    |
| Build     | `pnpm build`     |
| Storybook | `pnpm storybook` |

Backend: `cd backend && ./pocketbase serve` (schema lives in `backend/pb_migrations/`).
Stress-test data (local only, not in the Docker image): `./pocketbase seed [scale] --hooksDir=pb_seed`,
remove with `./pocketbase seed clean --hooksDir=pb_seed`. Seeded users: `user1@seed.test` … / `password123`.
