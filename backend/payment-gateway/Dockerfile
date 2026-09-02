# payment-gateway — Node 20, ESM, no native bindings, alpine is fine.
#
# NOTE: package.json currently lists "crypto" and "ampq" as dependencies.
# Both should be removed before building:
#   - "crypto" shadows Node's built-in crypto module with an old, unmaintained
#     npm package of the same name — just `import crypto from "crypto"`, no
#     install needed.
#   - "ampq" (not amqplib) looks like an abandoned/typo'd package from 2019 —
#     you already depend on the correctly-spelled "amqplib" for RabbitMQ.
# This Dockerfile will still build with them present, but clean up
# package.json first.

FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN addgroup -S appgroup && adduser -S nodeuser -G appgroup
USER nodeuser

EXPOSE 3003
CMD ["node", "src/server.js"]