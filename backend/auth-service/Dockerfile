
# auth-service — Node 20, ESM, uses bcrypt (native bindings) so we stay on
# a glibc-based image (slim) rather than alpine/musl to avoid rebuild issues.
 
FROM node:20-slim AS base
WORKDIR /app
 
# ---- deps stage: install only what's needed to run ----
FROM base AS deps
COPY package.json package-lock.json* ./
# omit=dev skips nodemon; if you don't have a package-lock.json yet, run
# `npm install` locally once to generate one for reproducible builds.
RUN npm install --omit=dev
 
# ---- final runtime image ----
FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
 
# winston writes to relative "logs/error.log" and "logs/combined.log",
# which resolve to /app/logs here. Create it and hand ownership to the
# non-root user before switching to it, or the app crashes on first log.
RUN mkdir -p logs && useradd --system --uid 1001 nodeuser && chown -R nodeuser:nodeuser /app
USER nodeuser
 
EXPOSE 3001
CMD ["node", "src/server.js"]
 
