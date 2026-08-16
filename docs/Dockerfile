FROM node:24-alpine AS build

RUN apk add --no-cache git

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json typedoc.json ./
COPY src ./src
COPY docs ./docs
COPY .git ./.git

RUN corepack enable
RUN pnpm install --frozen-lockfile

RUN pnpm docs:build

FROM caddy:alpine

COPY docs/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/docs/.vitepress/dist/ /srv/
