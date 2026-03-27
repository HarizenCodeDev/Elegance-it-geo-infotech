#!/bin/bash

echo "==================================="
echo "  Elegance EMS Deployment Script"
echo "==================================="

# 1. Start PostgreSQL
echo "[1/10] Starting PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql
echo "Done!"

# 2. Create Database
echo "[2/10] Creating database..."
sudo -u postgres psql -c "CREATE DATABASE elegance_ems;" 2>/dev/null || echo "Database already exists"
sudo -u postgres psql -c "CREATE USER elegance_user WITH PASSWORD 'elegance123';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE elegance_ems TO elegance_user;" 2>/dev/null || echo "Privileges already granted"
echo "Done!"

# 3. Install PM2
echo "[3/10] Installing PM2..."
sudo npm install -g pm2
echo "Done!"

# 4. Install NGINX
echo "[4/10] Installing NGINX..."
sudo apt install nginx -y 2>/dev/null || echo "NGINX already installed"
echo "Done!"

# 5. Create NGINX config
echo "[5/10] Configuring NGINX..."
sudo cp /mnt/663EE6F93EE6C0E3/Developer/006/Elegance1/nginx-config.txt /etc/nginx/sites-available/elegance-ems
sudo ln -sf /etc/nginx/sites-available/elegance-ems /etc/nginx/sites-enabled/elegance-ems
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
echo "Done!"

# 6. Deploy Frontend
echo "[6/10] Deploying Frontend..."
sudo mkdir -p /var/www/elegance-ems
sudo cp -r /mnt/663EE6F93EE6C0E3/Developer/006/Elegance1/Frontend/dist/* /var/www/elegance-ems/
sudo chown -R www-data:www-data /var/www/elegance-ems
echo "Done!"

# 7. Restart NGINX
echo "[7/10] Restarting NGINX..."
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager
echo "Done!"

# 8. Setup Firewall
echo "[8/10] Setting up Firewall..."
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw --force enable 2>/dev/null || echo "UFW already enabled or needs confirmation"
echo "Done!"

# 9. Run Database Migrations
echo "[9/10] Running Database Migrations..."
cd /mnt/663EE6F93EE6C0E3/Developer/006/Elegance1/server
npm run db:migrate
npm run db:seed
echo "Done!"

# 10. Start Backend with PM2
echo "[10/10] Starting Backend with PM2..."
cd /mnt/663EE6F93EE6C0E3/Developer/006/Elegance1/server
pm2 delete elegance-backend 2>/dev/null
pm2 start index.js --name elegance-backend
pm2 save
echo "Done!"

echo ""
echo "==================================="
echo "  Deployment Complete!"
echo "==================================="
echo ""
echo "Access your app at: http://192.168.91.65"
echo ""
echo "Useful commands:"
echo "  pm2 logs elegance-backend    - View backend logs"
echo "  pm2 restart elegance-backend - Restart backend"
echo "  pm2 status                   - Check status"
echo "  sudo systemctl restart nginx - Restart NGINX"
