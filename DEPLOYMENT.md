# PAPI Hair Design App - Deployment Guide

## Overview

This repository contains production-ready deployment scripts for the PAPI Hair Design App on Ubuntu 22 VPS. The deployment consists of two main scripts:

1. **`install.sh`** - System setup and dependencies installation
2. **`deploy.sh`** - Application deployment using Docker

## Prerequisites

- Fresh Ubuntu 22.04 VPS
- Root access (sudo privileges)
- Domain name pointing to your server (optional, for SSL)

## Quick Start

### 1. Run Installation Script

First, run the installation script to set up your VPS:

```bash
# Download and run the installation script
wget https://raw.githubusercontent.com/youh4ck3dme/papi-hair-design-app/main/install.sh
sudo bash install.sh [your-domain.com]

# Example with domain (for SSL):
sudo bash install.sh papihairdesign.sk

# Example without domain (HTTP only):
sudo bash install.sh
```

**Important**: After installation, logout and login again to ensure all environment changes take effect.

### 2. Run Deployment Script

After re-login, deploy the application:

```bash
cd /opt/papi-hair-design-app
bash deploy.sh [branch] [domain]

# Examples:
bash deploy.sh main papihairdesign.sk
bash deploy.sh development
```

## What Gets Installed

### System Components (`install.sh`)

- **System Updates**: Latest package updates for Ubuntu 22
- **Essential Packages**: curl, git, build-essential, etc.
- **Node.js**: Latest LTS version via nvm
- **Docker**: Latest stable version with Docker Compose
- **Nginx**: Web server for reverse proxy
- **UFW Firewall**: Configured with ports 22, 80, 443, 9002
- **SSL Certificates**: Automatic Let's Encrypt setup (if domain provided)
- **System Service**: Systemd service for application management

### Application Components (`deploy.sh`)

- **Repository**: Clones the PAPI Hair Design App
- **Docker Setup**: Creates optimized Dockerfile and docker-compose.yml
- **Nginx Configuration**: Reverse proxy with SSL termination
- **Health Monitoring**: Health check endpoints and monitoring
- **Environment Setup**: Production environment configuration
- **Utility Scripts**: Update and cleanup scripts

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
nano .env.local
```

Key variables to configure:
- Firebase credentials
- Domain settings
- Redis password
- SMTP settings for notifications

### Domain and SSL

If you have a domain:
1. Point your domain's A record to your server's IP
2. Run installation with domain: `sudo bash install.sh yourdomain.com`
3. SSL certificates will be automatically configured

Without domain:
- Application will be accessible via `http://YOUR_SERVER_IP`
- No SSL encryption (suitable for development only)

## Management Commands

### Service Management

```bash
# Check application status
sudo systemctl status papi-hair-design-app

# Start/stop/restart application
sudo systemctl start papi-hair-design-app
sudo systemctl stop papi-hair-design-app
sudo systemctl restart papi-hair-design-app

# View application logs
sudo journalctl -u papi-hair-design-app -f
```

### Docker Management

```bash
cd /opt/papi-hair-design-app

# View running containers
docker-compose ps

# View application logs
docker-compose logs -f

# Restart specific service
docker-compose restart app
docker-compose restart nginx

# Stop all services
docker-compose down

# Start all services
docker-compose up -d
```

### Utility Scripts

```bash
cd /opt/papi-hair-design-app

# Update application (pull latest code and redeploy)
bash update.sh

# Cleanup old Docker images and backups
bash cleanup.sh
```

## Monitoring and Health Checks

### Health Endpoint

The application includes a health check endpoint:
- **URL**: `https://yourdomain.com/api/health` or `http://server-ip/api/health`
- **Returns**: JSON with application status, uptime, and version

### Log Files

- **Application logs**: `/var/log/papi-hair-design-app/`
- **Nginx logs**: Docker volume `nginx-logs`
- **System service logs**: `journalctl -u papi-hair-design-app`

### Monitoring Tools

The deployment includes:
- Docker health checks for all services
- Automatic container restart on failure
- Watchtower for automatic updates (optional)

## Backup and Recovery

### Automated Backups

The deployment script creates backups automatically:
- Location: `/opt/papi-hair-design-app-backup-YYYYMMDD-HHMMSS/`
- Retention: Last 5 backups (cleaned by `cleanup.sh`)

### Manual Backup

```bash
# Create manual backup
sudo cp -r /opt/papi-hair-design-app /opt/papi-hair-design-app-backup-manual-$(date +%Y%m%d)

# Backup data volumes
docker run --rm -v papi-hair-design-app_app-data:/data -v $(pwd):/backup alpine tar czf /backup/app-data-backup.tar.gz -C /data .
```

### Recovery

```bash
# Restore from backup
sudo systemctl stop papi-hair-design-app
sudo rm -rf /opt/papi-hair-design-app
sudo mv /opt/papi-hair-design-app-backup-YYYYMMDD-HHMMSS /opt/papi-hair-design-app
sudo systemctl start papi-hair-design-app
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :80
   sudo systemctl stop apache2  # if Apache is running
   ```

2. **Docker permission denied**
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **SSL certificate issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

4. **Application not starting**
   ```bash
   cd /opt/papi-hair-design-app
   docker-compose logs app
   ```

### Performance Optimization

1. **Enable Docker BuildKit**
   ```bash
   echo 'export DOCKER_BUILDKIT=1' >> ~/.bashrc
   ```

2. **Optimize nginx cache**
   - Edit `/opt/papi-hair-design-app/nginx.conf`
   - Adjust cache settings based on your needs

3. **Monitor resource usage**
   ```bash
   htop
   docker stats
   ```

## Security Considerations

### Firewall

The installation configures UFW with minimal required ports:
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)
- 9002 (Application, if needed)

### SSL/TLS

- Automatic SSL certificate management with Let's Encrypt
- Modern TLS configuration (TLS 1.2+)
- HSTS headers for security

### Updates

- Automatic security updates via Watchtower (optional)
- Manual updates via `update.sh` script
- Regular Docker image updates

## Support

For issues and questions:
- Create an issue on GitHub
- Check logs: `docker-compose logs -f`
- Monitor health endpoint: `/api/health`

## License

This project is licensed under the MIT License.