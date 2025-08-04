# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies for both client and server
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm ci --only=production && npm cache clean --force

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules

COPY . .

# Build client
WORKDIR /app/client
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy server files
COPY --from=builder /app/server ./server
COPY --from=builder --chown=nextjs:nodejs /app/client/dist ./client/dist

# Copy node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules

USER nextjs

EXPOSE 5000

ENV PORT 5000

WORKDIR /app/server

CMD ["node", "server.js"]
