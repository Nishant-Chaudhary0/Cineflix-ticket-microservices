# booking-service — Node 20, ESM, no native bindings, alpine is fine and smaller.

FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# winston writes to relative "logs/error.log" and "logs/combined.log",
# which resolve to /app/logs here. Create it and hand ownership to the
# non-root user before switching to it, or the app crashes on first log.
RUN mkdir -p logs && addgroup -S appgroup && adduser -S nodeuser -G appgroup && chown -R nodeuser:appgroup /app
USER nodeuser

EXPOSE 3002
CMD ["node", "src/server.js"]