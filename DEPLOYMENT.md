# Deployment Guide

## 🖥️ Multi-VM Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NETWORK ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐          ┌──────────────────┐         │
│  │     VM 1         │          │     VM 2         │         │
│  │  (Database)      │          │ (App Server)     │         │
│  │                  │          │                  │         │
│  │  ┌────────────┐  │  MySQL   │  ┌────────────┐  │         │
│  │  │   MySQL    │◄─┼──Port────┼──│  Backend   │  │         │
│  │  │   Server   │  │  3306    │  │  (Node.js) │  │         │
│  │  │            │  │          │  │  Port 5000 │  │         │
│  │  └────────────┘  │          │  └────────────┘  │         │
│  │                  │          │                  │         │
│  │  IP: 192.168.1.10│          │  ┌────────────┐  │         │
│  │                  │          │  │  Frontend  │  │         │
│  │                  │          │  │  (Static)  │  │         │
│  │                  │          │  │  Port 80   │  │         │
│  │                  │          │  └────────────┘  │         │
│  │                  │          │                  │         │
│  │                  │          │  IP: 192.168.1.20│         │
│  └──────────────────┘          └──────────────────┘         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 VM 1: Database Server Setup

### 1. Install MySQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Configure MySQL for Remote Access

```bash
# Edit MySQL config
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Change bind-address from 127.0.0.1 to:
bind-address = 0.0.0.0
```

### 3. Create Database and User

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE fyp_secure_db;

-- Create user for remote access (replace IP with VM2's IP)
CREATE USER 'fyp_user'@'192.168.1.20' IDENTIFIED BY 'SecurePassword123!';
GRANT ALL PRIVILEGES ON fyp_secure_db.* TO 'fyp_user'@'192.168.1.20';
FLUSH PRIVILEGES;

-- Import schema
USE fyp_secure_db;
SOURCE /path/to/schema.sql;
```

### 4. Open Firewall

```bash
sudo ufw allow 3306/tcp
sudo systemctl restart mysql
```

---

## 🔧 VM 2: Application Server Setup

### 1. Install Node.js

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Install Nginx (for frontend)

```bash
sudo apt install nginx
```

### 3. Deploy Backend

```bash
# Copy server folder to VM
cd /var/www/fyp-backend

# Install dependencies
npm install

# Edit .env to point to VM1
nano .env
```

**Update `server/.env`:**

```env
DB_HOST=192.168.1.10    # VM1's IP address
DB_PORT=3306
DB_USER=fyp_user
DB_PASSWORD=SecurePassword123!
DB_NAME=fyp_secure_db
JWT_SECRET=your-secure-secret
FRONTEND_URL=http://192.168.1.20
```

### 4. Run Backend with PM2

```bash
# Install PM2 (process manager)
sudo npm install -g pm2

# Start backend
pm2 start index.js --name fyp-backend
pm2 save
pm2 startup
```

### 5. Build Frontend

```bash
# On your local machine
cd fyp-dashboard-modern

# Update API URL in AuthContext.jsx:
# const API_URL = 'http://192.168.1.20:5000/api';

# Build for production
npm run build
```

### 6. Deploy Frontend to Nginx

```bash
# Copy /dist folder to VM2
sudo cp -r dist/* /var/www/html/

# Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name _;
    root /var/www/html;
    index index.html;

    # Frontend (SPA routing)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Restart Nginx
sudo systemctl restart nginx
```

---

## 🔐 Security Recommendations

1. **Use HTTPS** - Get SSL certificates (Let's Encrypt)
2. **Firewall Rules** - Only allow necessary ports
3. **Strong Passwords** - For MySQL and JWT secret
4. **Environment Variables** - Never commit `.env` files with secrets
5. **Network Segmentation** - Database VM should only accept connections from App VM

---

## 🌐 Access the Application

After deployment, access via:

- **Frontend**: `http://192.168.1.20` (or your VM2 IP)
- **Backend API**: `http://192.168.1.20:5000/api`

---

## 📋 Quick Checklist

### For Multi-VM Deployment

- [ ] VM1: MySQL installed and configured for remote access
- [ ] VM1: Firewall allows port 3306
- [ ] VM2: Node.js and Nginx installed
- [ ] VM2: Backend `.env` points to VM1's IP
- [ ] VM2: Frontend API_URL updated and built
- [ ] VM2: PM2 running backend
- [ ] VM2: Nginx serving frontend
