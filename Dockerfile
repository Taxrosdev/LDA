FROM oven/bun:alpine AS build
WORKDIR /app

ARG GIT_HASH
ENV GIT_HASH=$GIT_HASH

COPY package.json bun.lock .

RUN bun install --frozen-lockfile

COPY . .

ENTRYPOINT [ "bun", "run", "." ]
