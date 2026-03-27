# Elegance EMS - Kali Linux Deployment Guide

## Prerequisites
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm nginx postgresql postgresql-contrib certbot python3-certbot-nginx
```

## STEP 1: Database Setup (PostgreSQL)

```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```
```sql
CREATE DATABASE elegance_ems;
CREATE USER elegance_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE elegance_ems TO elegance_user;
\q
```

## STEP 2: Backend Setup

```bash
cd /mnt/663EE6F93EE6C0E3/Developer/006/Elegance1/server

npm install
```

Create production `.env`:
```bash
nano .env
```
```
PORT=5000
DB_URL=postgresql://elegance_user:your_secure_password@localhost:5432/elegance_ems
JWT_SECRET=your_very_long_random_secret_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
FRONTEND_URL=http://your_ip_or_domain
```

**Update knexfile.js for production** (already configured):
```javascript
production: {
  client: "pg",
  connection: process.env.DB_URL,
  ssl: { rejectUnauthorized: false },
  migrations: {
    directory: "./migrations",
    extension: "js",
  },
  pool: {
    min: 2,
    max: 10,
  },
},
```

Run migrations:
```bash
npm run db:migrate
npm run db:seed
```

## STEP 3: PM2 Setup (Keep Server Running)

```bash
sudo npm install -g pm2

# Start backend with PM2
pm2 start index.js --name elegance-backend

# Save PM2 process list
pm2 save

# Auto-restart on reboot
pm2 startup
```

**PM2 Commands:**
```bash
pm2 logs elegance-backend     # View logs
pm2 restart elegance-backend  # Restart server
pm2 status                    # Check status
```

## STEP 4: Build Frontend

```bash
cd /mnt/663EE6F93EE6C0E3/Developer/006/Elegance1/Frontend

npm install
npm run build
```

## STEP 5: NGINX Configuration

```bash
sudo nano /etc/nginx/sites-available/elegance-ems
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name YOUR_IP_OR_DOMAIN;

    root /var/www/elegance-ems/dist;
    index index.html;

    # Frontend routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads static files
    location /uploads/ {
        proxy_pass http://localhost:5000/uploads/;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/elegance-ems /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-available/default  # Remove default if exists
sudo nginx -t                              # Test config
sudo systemctl restart nginx
```

## STEP 6: Deploy Frontend Build

```bash
sudo mkdir -p /var/www/elegance-ems
sudo cp -r /mnt/663EE6F93EE6C0E3/Developer/006/Elegance1/Frontend/dist/* /var/www/elegance-ems/
sudo chown -R www-data:www-data /var/www/elegance-ems
```

## STEP 7: Firewall Setup

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp   # SSH
sudo ufw --force enable
sudo ufw status
```

## STEP 8: Get Your IP & Test

```bash
hostname -I
```

Access: `http://YOUR_IP`

## STEP 9: HTTPS Setup (Recommended)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your_domain.com
```

For IP-only access (no domain), SSL is optional but recommended once you have a domain.

## STEP 10: Update Frontend API URL

Update `Frontend/src/config/api.js` (or wherever your API base URL is defined) to point to your server's IP/domain, or set it dynamically:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

## Architecture

```
User → NGINX (Port 80/443)
        ↓
Frontend (React Build - /var/www/elegance-ems)
        ↓
API (/api) → Proxy → Node.js (PM2 - Port 5000)
        ↓
PostgreSQL (Port 5432)
```

## Troubleshooting

```bash
# Check backend logs
pm2 logs elegance-backend

# Check NGINX errors
sudo tail -f /var/log/nginx/error.log

# Restart everything
sudo systemctl restart nginx
pm2 restart elegance-backend

# Check ports
sudo ss -tlnp | grep -E '80|443|5000|5432'
```
