# SUPER GOAT ROYALTIES - Multi-Stage Docker Build

# Stage 1: Base image with Node.js
FROM node:20-alpine AS base

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Set working directory
WORKDIR /app

# Stage 2: Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 3: Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install additional dependencies
RUN apk add --no-cache \
    curl \
    wget

# Stage 4: Production
FROM node:20-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    curl \
    wget \
    dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy dependencies and application
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# Create public directory and set permissions
RUN mkdir -p public && \
    chown -R nodejs:nodejs /app

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/status', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Switch to non-root user
USER nodejs

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["npm", "start"]