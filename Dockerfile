# syntax=docker/dockerfile:1

# ---- Frontend: build the React app into static files ----
FROM node:22-alpine AS frontend
ARG PNPM_VERSION=12.4.2
RUN npm install --global pnpm@${PNPM_VERSION}
WORKDIR /app
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ ./
RUN pnpm build

# ---- Runtime: PocketBase serves the API and the built frontend ----
FROM alpine:3.22
ARG PB_VERSION=0.40.4
# Set by BuildKit to the build platform's arch (amd64 / arm64), which matches PocketBase's release names.
ARG TARGETARCH

# ca-certificates: PocketBase needs them for TLS to the SMTP provider.
RUN apk add --no-cache ca-certificates \
  && wget -q -O /tmp/pocketbase.zip \
    "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${TARGETARCH}.zip" \
  && unzip -q /tmp/pocketbase.zip pocketbase -d /pb \
  && rm /tmp/pocketbase.zip

COPY backend/pb_migrations /pb/pb_migrations
COPY backend/pb_hooks /pb/pb_hooks
COPY --from=frontend /app/dist /pb/pb_public

# pb_data is the database: mount a persistent volume at /pb/pb_data, or every deploy starts empty.

EXPOSE 8090
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://127.0.0.1:8090/api/health || exit 1

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
