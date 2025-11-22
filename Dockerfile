# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files (including public directory)
COPY . .

# Ensure public directory exists and has index.html
RUN mkdir -p public && \
    if [ ! -f public/index.html ]; then \
        echo '<!DOCTYPE html><html><head><title>GOAT Royalties</title></head><body><h1>GOAT Royalties Loading...</h1></body></html>' > public/index.html; \
    fi

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/status', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["npm", "start"]
