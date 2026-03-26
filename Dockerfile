# SUPER GOAT ROYALTIES APP - Docker Image
# Multi-stage build for optimized production image

# ============================================
# Stage 1: Build stage
# ============================================
FROM node:18-alpine AS builder

LABEL maintainer="GOAT Royalty Team <contact@goatroyaltyapp.org>"
LABEL description="SUPER GOAT ROYALTIES APP - AI-Powered Music Royalty Management Platform"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --ignore-scripts

# ============================================
# Stage 2: Production stage
# ============================================
FROM node:18-alpine AS production

# Security: Run as non-root user
RUN addgroup -g 1001 -S goatgroup && \
    adduser -S goatuser -u 1001 -G goatgroup

# Set working directory
WORKDIR /app

# Copy node_modules from builder
COPY --from=builder --chown=goatuser:goatgroup /app/node_modules ./node_modules

# Copy application files
COPY --chown=goatuser:goatgroup package.json ./
COPY --chown=goatuser:goatgroup server.js ./
COPY --chown=goatuser:goatgroup lib ./lib
COPY --chown=goatuser:goatgroup public ./public
COPY --chown=goatuser:goatgroup local-data ./local-data

# Create necessary directories
RUN mkdir -p /app/data /app/logs /app/datasets && \
    chown -R goatuser:goatgroup /app/data /app/logs /app/datasets

# Set environment variables
ENV NODE_ENV=production \
    PORT=4001 \
    DATA_DIR=/app/data \
    LOG_DIR=/app/logs

# Expose port
EXPOSE 4001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4001/api/status || exit 1

# Switch to non-root user
USER goatuser

# Start the application
CMD ["node", "server.js"]

# ============================================
# Stage 3: Development stage (optional)
# ============================================
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy application files
COPY . .

# Set environment variables
ENV NODE_ENV=development \
    PORT=4001

# Expose port
EXPOSE 4001

# Start in development mode with hot reload
CMD ["npm", "run", "dev"]