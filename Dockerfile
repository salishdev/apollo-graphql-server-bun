FROM oven/bun:latest AS base
WORKDIR /usr/src/app

FROM base AS builder
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

COPY . .

ENV NODE_ENV=production
RUN bun run build

FROM base AS release
COPY --from=builder /usr/src/app/dist/server ./dist/server

USER bun
EXPOSE 4000/tcp
CMD ["/usr/src/app/dist/server"]
