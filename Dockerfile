# syntax=docker/dockerfile:experimental

# Install dependencies only when needed
FROM node:alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat git openssh-client

WORKDIR /app
COPY package.json yarn.lock ./
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
RUN yarn cache clean
RUN --mount=type=ssh,id=cloudbuild_github yarn install --network-timeout 100000 --network-concurrency 1 --frozen-lockfile

# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
ARG CUSTOMER_ACCOUNT_ID
ARG API_BASE_URL
ARG WEBSOCKET_BASE_URL
ARG KEYCLOAK_BASE_URL
ARG KEYCLOAK_REALM
ARG KEYCLOAK_CLIENT_ID
RUN echo "NEXT_PUBLIC_CUSTOMER_ACCOUNT_ID=${CUSTOMER_ACCOUNT_ID}" >> .env.local
RUN echo "NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL}" >> .env.local
RUN echo "NEXT_PUBLIC_WEBSOCKET_BASE_URL=${WEBSOCKET_BASE_URL}" >> .env.local
RUN echo "NEXT_PUBLIC_KEYCLOAK_BASE_URL=${KEYCLOAK_BASE_URL}" >> .env.local
RUN echo "NEXT_PUBLIC_KEYCLOAK_REALM=${KEYCLOAK_REALM}" >> .env.local
RUN echo "NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=${KEYCLOAK_CLIENT_ID}" >> .env.local
RUN yarn build

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/.next
USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
RUN npx next telemetry disable

CMD ["yarn", "start"]
