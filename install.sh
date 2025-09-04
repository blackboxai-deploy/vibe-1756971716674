#!/bin/bash

# =============================================================================
# PAPI Hair Design App - Ubuntu 22 VPS Installation Script
# =============================================================================
# This script installs all necessary dependencies and configures the system
# for deploying the PAPI Hair Design App on an Ubuntu 22 VPS.
#
# Usage: sudo bash install.sh [domain]
# Example: sudo bash install.sh yourdomain.com
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
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root (use sudo)"
   exit 1
fi

# Get domain from command line argument
DOMAIN=${1:-""}
if [[ -z "$DOMAIN" ]]; then
    warn "No domain provided. SSL certificates will not be configured."
    warn "Usage: sudo bash install.sh [domain]"
    read -p "Continue without domain? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get non-root user
REAL_USER=${SUDO_USER:-$(whoami)}
USER_HOME=$(eval echo ~$REAL_USER)

log "Starting PAPI Hair Design App installation on Ubuntu 22..."
log "Domain: ${DOMAIN:-'Not provided'}"
log "User: $REAL_USER"
log "User Home: $USER_HOME"

# =============================================================================
# 1. SYSTEM UPDATE AND BASIC PACKAGES
# =============================================================================
log "Step 1: Updating system and installing basic packages..."

apt-get update -y
apt-get upgrade -y

# Install essential packages
apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    unzip \
    vim \
    htop \
    ufw \
    nginx \
    snapd

log "Basic packages installed successfully"

# =============================================================================
# 2. NODE.JS INSTALLATION (via nvm)
# =============================================================================
log "Step 2: Installing Node.js via nvm..."

# Install nvm for the non-root user
NVM_VERSION="v0.39.0"
sudo -u $REAL_USER bash -c "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh | bash"

# Load nvm and install latest LTS Node.js
sudo -u $REAL_USER bash -c "
    export NVM_DIR=\"$USER_HOME/.nvm\"
    [ -s \"\$NVM_DIR/nvm.sh\" ] && \. \"\$NVM_DIR/nvm.sh\"
    [ -s \"\$NVM_DIR/bash_completion\" ] && \. \"\$NVM_DIR/bash_completion\"
    nvm install --lts
    nvm use --lts
    nvm alias default lts/*
"

# Add nvm to profile for automatic loading
sudo -u $REAL_USER bash -c "
    echo 'export NVM_DIR=\"\$HOME/.nvm\"' >> $USER_HOME/.bashrc
    echo '[ -s \"\$NVM_DIR/nvm.sh\" ] && \. \"\$NVM_DIR/nvm.sh\"' >> $USER_HOME/.bashrc
    echo '[ -s \"\$NVM_DIR/bash_completion\" ] && \. \"\$NVM_DIR/bash_completion\"' >> $USER_HOME/.bashrc
"

log "Node.js installed successfully via nvm"

# =============================================================================
# 3. DOCKER INSTALLATION
# =============================================================================
log "Step 3: Installing Docker..."

# Remove old Docker versions if they exist
apt-get remove -y docker docker-engine docker.io containerd runc || true

# Add Docker's official GPG key
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group
usermod -aG docker $REAL_USER

# Start and enable Docker
systemctl start docker
systemctl enable docker

log "Docker installed successfully"

# =============================================================================
# 4. FIREWALL CONFIGURATION
# =============================================================================
log "Step 4: Configuring firewall (UFW)..."

# Reset UFW to default
ufw --force reset

# Default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (assuming standard port 22)
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Allow application port (9002 as per package.json)
ufw allow 9002/tcp

# Enable UFW
ufw --force enable

# Show status
ufw status verbose

log "Firewall configured successfully"

# =============================================================================
# 5. SSL CERTIFICATE SETUP (if domain provided)
# =============================================================================
if [[ -n "$DOMAIN" ]]; then
    log "Step 5: Setting up SSL certificate for domain: $DOMAIN"
    
    # Install Certbot
    snap install core; snap refresh core
    snap install --classic certbot
    
    # Create symlink for certbot command
    ln -sf /snap/bin/certbot /usr/bin/certbot
    
    # Create basic nginx configuration for domain verification
    cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}
EOF
    
    # Enable the site
    ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
    
    # Remove default nginx site
    rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx configuration
    nginx -t
    
    # Restart nginx
    systemctl restart nginx
    
    # Obtain SSL certificate
    info "Obtaining SSL certificate for $DOMAIN..."
    info "Make sure your domain points to this server's IP address"
    
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    log "SSL certificate configured successfully for $DOMAIN"
else
    log "Step 5: Skipping SSL certificate setup (no domain provided)"
fi

# =============================================================================
# 6. CREATE APPLICATION DIRECTORY AND SET PERMISSIONS
# =============================================================================
log "Step 6: Setting up application directory..."

# Create application directory
APP_DIR="/opt/papi-hair-design-app"
mkdir -p $APP_DIR
chown $REAL_USER:$REAL_USER $APP_DIR

# Create logs directory
mkdir -p /var/log/papi-hair-design-app
chown $REAL_USER:$REAL_USER /var/log/papi-hair-design-app

log "Application directory setup completed"

# =============================================================================
# 7. CREATE SYSTEMD SERVICE (for process management)
# =============================================================================
log "Step 7: Creating systemd service..."

cat > /etc/systemd/system/papi-hair-design-app.service << EOF
[Unit]
Description=PAPI Hair Design App
After=network.target
Wants=network.target

[Service]
Type=simple
User=$REAL_USER
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
Environment=PORT=9002
ExecStart=/usr/bin/docker-compose -f $APP_DIR/docker-compose.yml up
ExecStop=/usr/bin/docker-compose -f $APP_DIR/docker-compose.yml down
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable service (but don't start yet)
systemctl daemon-reload
systemctl enable papi-hair-design-app

log "Systemd service created and enabled"

# =============================================================================
# 8. FINAL CONFIGURATION AND CLEANUP
# =============================================================================
log "Step 8: Final configuration and cleanup..."

# Update package index one more time
apt-get update -y

# Clean up unnecessary packages
apt-get autoremove -y
apt-get autoclean

# Set up log rotation for application logs
cat > /etc/logrotate.d/papi-hair-design-app << EOF
/var/log/papi-hair-design-app/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    copytruncate
}
EOF

log "Log rotation configured"

# =============================================================================
# INSTALLATION COMPLETE
# =============================================================================
log "=============================================="
log "PAPI Hair Design App installation completed!"
log "=============================================="
info "Next steps:"
info "1. Logout and login again (or run 'su - $REAL_USER') to load nvm"
info "2. Run the deploy.sh script to deploy the application:"
info "   cd $APP_DIR"
info "   bash deploy.sh"
if [[ -n "$DOMAIN" ]]; then
    info "3. Your app will be available at: https://$DOMAIN"
else
    info "3. Your app will be available at: http://YOUR_SERVER_IP:9002"
fi
info "4. Check service status: sudo systemctl status papi-hair-design-app"
info "5. View logs: sudo journalctl -u papi-hair-design-app -f"

# Display system information
info "=============================================="
info "System Information:"
info "OS: $(lsb_release -d | cut -f2)"
info "Docker version: $(docker --version)"
info "Node.js will be available after re-login"
info "UFW status: $(ufw status | head -1)"
if [[ -n "$DOMAIN" ]]; then
    info "SSL certificate status: $(certbot certificates | grep -A 1 $DOMAIN || echo 'Check manually')"
fi
info "=============================================="

warn "IMPORTANT: Please logout and login again before running deploy.sh"
warn "This ensures nvm and Docker group membership are properly loaded"

exit 0