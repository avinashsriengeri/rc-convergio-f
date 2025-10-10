# ---- build stage ----
FROM node:20-alpine AS build

# Set work dir inside container
WORKDIR /app

# Copy only package files first (better layer caching)
COPY package*.json ./

# Install deps (CI-friendly, reproducible)
RUN npm ci --no-audit --no-fund

# Copy the rest of the source
COPY . .

# Build the production bundle (Vite)
# If your script name differs, change "build" accordingly.
RUN npm run build

# ---- run stage ----
FROM nginx:alpine

# Remove default config and use ours
RUN rm -f /etc/nginx/conf.d/default.conf
COPY infra/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Health check (optional but nice)
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ || exit 1

EXPOSE 80

# nginx runs as default CMD
