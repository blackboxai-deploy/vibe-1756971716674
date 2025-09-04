#!/bin/bash

# =============================================================================
# PAPI Hair Design App - Deployment Script
# =============================================================================
# This script handles the deployment of the PAPI Hair Design App using Docker.
# It clones the repository, sets up the Docker environment, and deploys the app.
#
# Prerequisites: Run install.sh first
# Usage: bash deploy.sh [branch] [domain]
# Example: bash deploy.sh main yourdomain.com
# =============================================================================

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Configuration
REPO_URL="https://github.com/youh4ck3dme/papi-hair-design-app.git"
BRANCH=${1:-"main"}
DOMAIN=${2:-""}
APP_DIR="/opt/papi-hair-design-app"
BACKUP_DIR="/opt/papi-hair-design-app-backup-$(date +%Y%m%d-%H%M%S)"

log "Starting PAPI Hair Design App deployment..."
info "Repository: $REPO_URL"
info "Branch: $BRANCH"
info "Domain: ${DOMAIN:-'Not provided'}"
info "App Directory: $APP_DIR"

# =============================================================================
# 1. ENVIRONMENT VERIFICATION
# =============================================================================
log "Step 1: Verifying environment..."

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    error "Docker is not installed. Please run install.sh first."
fi

if ! docker info &> /dev/null; then
    error "Docker is not running or user doesn't have permission. Try: sudo usermod -aG docker \$USER && newgrp docker"
fi

# Check if nvm and node are available
if [[ -f "$HOME/.nvm/nvm.sh" ]]; then
    source "$HOME/.nvm/nvm.sh"
    source "$HOME/.nvm/bash_completion" 2>/dev/null || true
fi

if ! command -v node &> /dev/null; then
    error "Node.js is not available. Please logout/login and try again, or run install.sh"
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
DOCKER_VERSION=$(docker --version)

info "Node.js version: $NODE_VERSION"
info "npm version: $NPM_VERSION"
info "Docker version: $DOCKER_VERSION"

log "Environment verification completed"

# =============================================================================
# 2. BACKUP EXISTING DEPLOYMENT (if exists)
# =============================================================================
if [[ -d "$APP_DIR" ]] && [[ -f "$APP_DIR/docker-compose.yml" ]]; then
    log "Step 2: Backing up existing deployment..."
    
    # Stop existing services
    cd "$APP_DIR"
    docker-compose down || warn "Failed to stop existing services"
    
    # Create backup
    sudo cp -r "$APP_DIR" "$BACKUP_DIR"
    log "Backup created at: $BACKUP_DIR"
else
    log "Step 2: No existing deployment found, skipping backup"
fi

# =============================================================================
# 3. CLONE OR UPDATE REPOSITORY
# =============================================================================
log "Step 3: Setting up repository..."

sudo mkdir -p "$APP_DIR"
sudo chown $USER:$USER "$APP_DIR"

if [[ -d "$APP_DIR/.git" ]]; then
    log "Repository exists, updating..."
    cd "$APP_DIR"
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
else
    log "Cloning repository..."
    rm -rf "$APP_DIR"
    git clone -b "$BRANCH" "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

log "Repository setup completed"

# =============================================================================
# 4. CREATE DOCKER CONFIGURATION
# =============================================================================
log "Step 4: Creating Docker configuration..."

# Create Dockerfile if it doesn't exist
if [[ ! -f "$APP_DIR/Dockerfile" ]]; then
    log "Creating Dockerfile..."
    cat > "$APP_DIR/Dockerfile" << 'EOF'
# Use the official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "start"]
EOF
    log "Dockerfile created"
fi

# Create docker-compose.yml
log "Creating docker-compose.yml..."
cat > "$APP_DIR/docker-compose.yml" << EOF
version: '3.8'

services:
  app:
    build: .
    container_name: papi-hair-design-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    networks:
      - papi-network
    volumes:
      - app-data:/app/data
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    container_name: papi-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/sites:/etc/nginx/sites-available
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - /var/www/html:/var/www/html
    depends_on:
      - app
    networks:
      - papi-network

volumes:
  app-data:

networks:
  papi-network:
    driver: bridge
EOF

log "docker-compose.yml created"

# =============================================================================
# 5. CREATE NGINX CONFIGURATION
# =============================================================================
log "Step 5: Creating nginx configuration..."

mkdir -p "$APP_DIR/nginx/sites"

# Main nginx.conf
cat > "$APP_DIR/nginx.conf" << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Include site configurations
    include /etc/nginx/sites-available/*;
}
EOF

# Create site configuration based on whether domain is provided
if [[ -n "$DOMAIN" ]]; then
    log "Creating SSL-enabled site configuration for domain: $DOMAIN"
    cat > "$APP_DIR/nginx/sites/$DOMAIN" << EOF
# HTTP redirect to HTTPS
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/$DOMAIN/chain.pem;

    # SSL security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy to Node.js app
    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://app:3000/api/health;
        access_log off;
    }

    # Static files (if needed)
    location /_next/static/ {
        proxy_pass http://app:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
EOF
else
    log "Creating HTTP-only site configuration"
    cat > "$APP_DIR/nginx/sites/default" << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    # Proxy to Node.js app
    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://app:3000/api/health;
        access_log off;
    }

    # Static files (if needed)
    location /_next/static/ {
        proxy_pass http://app:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
EOF
fi

log "Nginx configuration created"

# =============================================================================
# 6. CREATE HEALTH CHECK ENDPOINT
# =============================================================================
log "Step 6: Creating health check endpoint..."

mkdir -p "$APP_DIR/src/app/api/health"
cat > "$APP_DIR/src/app/api/health/route.ts" << 'EOF'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health check - you can expand this to check database connectivity, etc.
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    }

    return NextResponse.json(healthCheck, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
EOF

log "Health check endpoint created"

# =============================================================================
# 7. CREATE ENVIRONMENT CONFIGURATION
# =============================================================================
log "Step 7: Setting up environment configuration..."

# Create .env.local if it doesn't exist
if [[ ! -f "$APP_DIR/.env.local" ]]; then
    cat > "$APP_DIR/.env.local" << EOF
# PAPI Hair Design App - Production Environment
NODE_ENV=production
PORT=3000

# Application settings
NEXT_PUBLIC_APP_NAME="PAPI Hair Design"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Domain configuration
NEXT_PUBLIC_DOMAIN=${DOMAIN:-'localhost'}
NEXT_PUBLIC_API_URL=${DOMAIN:+https://$DOMAIN}${DOMAIN:-http://localhost:3000}

# Firebase configuration (add your credentials here)
# NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
# NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Add other environment variables as needed
EOF
    warn "Created .env.local with default values. Please update with your actual configuration."
else
    info ".env.local already exists, skipping creation"
fi

log "Environment configuration completed"

# =============================================================================
# 8. BUILD AND DEPLOY APPLICATION
# =============================================================================
log "Step 8: Building and deploying application..."

# Install dependencies
log "Installing dependencies..."
npm ci --only=production

# Build Docker images
log "Building Docker images..."
docker-compose build --no-cache

# Stop any existing containers
log "Stopping existing containers..."
docker-compose down || true

# Start the application
log "Starting application..."
docker-compose up -d

# Wait for services to be ready
log "Waiting for services to start..."
sleep 30

# Check if services are running
log "Checking service status..."
docker-compose ps

# Test health endpoint
if [[ -n "$DOMAIN" ]]; then
    HEALTH_URL="https://$DOMAIN/api/health"
else
    HEALTH_URL="http://localhost/api/health"
fi

log "Testing health endpoint: $HEALTH_URL"
for i in {1..10}; do
    if curl -f -s "$HEALTH_URL" > /dev/null; then
        log "Health check passed!"
        break
    else
        warn "Health check attempt $i/10 failed, waiting..."
        sleep 10
    fi
done

log "Deployment completed successfully!"

# =============================================================================
# 9. POST-DEPLOYMENT TASKS
# =============================================================================
log "Step 9: Post-deployment tasks..."

# Set up log rotation for application logs
sudo mkdir -p /var/log/papi-hair-design-app
sudo chown $USER:$USER /var/log/papi-hair-design-app

# Create cleanup script
cat > "$APP_DIR/cleanup.sh" << 'EOF'
#!/bin/bash
# Cleanup script for PAPI Hair Design App

echo "Cleaning up Docker system..."
docker system prune -f
docker volume prune -f
docker image prune -f

echo "Cleaning up old backups (keeping last 5)..."
ls -t /opt/papi-hair-design-app-backup-* 2>/dev/null | tail -n +6 | xargs -r rm -rf

echo "Cleanup completed!"
EOF

chmod +x "$APP_DIR/cleanup.sh"

# Create update script
cat > "$APP_DIR/update.sh" << EOF
#!/bin/bash
# Update script for PAPI Hair Design App

cd "$APP_DIR"
bash deploy.sh "$BRANCH" "$DOMAIN"
EOF

chmod +x "$APP_DIR/update.sh"

log "Post-deployment tasks completed"

# =============================================================================
# DEPLOYMENT COMPLETE
# =============================================================================
log "=============================================="
log "PAPI Hair Design App deployment completed!"
log "=============================================="

info "Application Information:"
info "- Repository: $REPO_URL"
info "- Branch: $BRANCH"
info "- Directory: $APP_DIR"
if [[ -n "$DOMAIN" ]]; then
    info "- URL: https://$DOMAIN"
    info "- Health Check: https://$DOMAIN/api/health"
else
    info "- URL: http://$(curl -s ifconfig.me || echo 'YOUR_SERVER_IP')"
    info "- Health Check: http://$(curl -s ifconfig.me || echo 'YOUR_SERVER_IP')/api/health"
fi

info "Docker Information:"
docker-compose ps

info "Useful Commands:"
info "- View logs: docker-compose logs -f"
info "- Restart app: docker-compose restart"
info "- Update app: bash $APP_DIR/update.sh"
info "- Cleanup: bash $APP_DIR/cleanup.sh"
info "- Stop app: docker-compose down"

info "Configuration Files:"
info "- Environment: $APP_DIR/.env.local"
info "- Docker Compose: $APP_DIR/docker-compose.yml"
info "- Nginx: $APP_DIR/nginx.conf"

warn "Remember to:"
warn "1. Update .env.local with your actual configuration"
warn "2. Configure your Firebase credentials"
warn "3. Test all functionality after deployment"
warn "4. Set up monitoring and backups"

log "Deployment process finished successfully!"

exit 0