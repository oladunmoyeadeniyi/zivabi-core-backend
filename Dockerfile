# Ziva BI - Core Backend Dockerfile
# -----------------------------------
# This container image runs the NestJS backend on Render or any Docker host.
# It uses a multi-stage build for a smaller production image.

# -------------------------------------------------------------------
# Stage 1: Build
# -------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (better layer caching)
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
# Using npm install since package-lock.json may not exist
RUN npm install

# Copy source code
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src

# Build the NestJS application
RUN npm run build

# -------------------------------------------------------------------
# Stage 2: Production
# -------------------------------------------------------------------
FROM node:20-alpine AS production

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package files and lock file from builder
COPY package.json ./
COPY --from=builder /app/package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built output from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on (Render will inject PORT env var)
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
