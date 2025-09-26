# 🚀 BACKEND DEPLOYMENT & INTEGRATION GUIDE

## Complete Guide to Deploy and Integrate the Secure Backend

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Cloud Deployment Options](#cloud-deployment-options)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Frontend Integration](#frontend-integration)
7. [Testing & Verification](#testing--verification)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🔧 PREREQUISITES

### Required Services
- **Node.js** v18+ and pnpm
- **MongoDB** Atlas account or local MongoDB
- **Redis** Cloud account or local Redis
- **SendGrid** or SMTP service for emails
- **Stripe** account for payment verification
- **AWS** account (optional, for KMS)
- **Domain** with SSL certificate

### Development Tools
```bash
# Install backend dependencies
cd backend
pnpm install

# Install MongoDB locally (optional)
brew install mongodb-community  # macOS
sudo apt-get install mongodb     # Ubuntu

# Install Redis locally (optional)
brew install redis               # macOS
sudo apt-get install redis-server # Ubuntu
```

---

## 💻 LOCAL DEVELOPMENT SETUP

### Step 1: Configure Environment Variables
Create `backend/.env`:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Database
MONGODB_URI=mongodb://localhost:27017/stealth-learning
REDIS_URL=redis://localhost:6379

# Security - Generate these!
JWT_PRIVATE_KEY=$(openssl genrsa 4096)
JWT_PUBLIC_KEY=$(openssl rsa -in private.key -pubout)
SESSION_SECRET=$(openssl rand -hex 32)

# Email Service (Choose one)
SENDGRID_API_KEY=SG.xxxxx
# OR
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Stripe (for verification)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4173

# Application URLs
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:4173

# AWS KMS (Optional)
AWS_KMS_ENABLED=false
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=xxxxx
# AWS_SECRET_ACCESS_KEY=xxxxx
# AWS_KMS_KEY_ID=xxxxx
```

### Step 2: Start Local Services

```bash
# Terminal 1: Start MongoDB
mongod --dbpath ./data/db

# Terminal 2: Start Redis
redis-server

# Terminal 3: Start Backend Server
cd backend
pnpm dev

# Backend will run on http://localhost:3000
```

### Step 3: Initialize Database

```bash
# Run migrations
cd backend
pnpm migrate

# Seed test data (optional)
pnpm seed
```

---

## ☁️ CLOUD DEPLOYMENT OPTIONS

### Option 1: Deploy to Heroku

```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login to Heroku
heroku login

# Create app
heroku create stealth-learning-api

# Add MongoDB (Atlas)
heroku addons:create mongolab:sandbox

# Add Redis
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_PRIVATE_KEY="$(cat private.key)"
heroku config:set JWT_PUBLIC_KEY="$(cat public.key)"
# ... set all other env vars

# Deploy
git push heroku main

# Scale dynos
heroku ps:scale web=1
```

### Option 2: Deploy to AWS EC2

```bash
# Launch EC2 instance (Ubuntu 22.04)
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2

# Clone repository
git clone https://github.com/yourusername/stealth-learning.git
cd stealth-learning/backend

# Install dependencies
pnpm install

# Build
pnpm build

# Start with PM2
pm2 start dist/index.js --name stealth-learning-api
pm2 save
pm2 startup

# Configure Nginx
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/stealth-learning

# Add this configuration:
```

```nginx
server {
    listen 80;
    server_name api.stealth-learning.app;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/stealth-learning /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL with Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.stealth-learning.app
```

### Option 3: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd backend
vercel --prod

# Set environment variables in Vercel dashboard
```

### Option 4: Deploy with Docker

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build
RUN pnpm build

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/index.js"]
```

```bash
# Build Docker image
docker build -t stealth-learning-api ./backend

# Run container
docker run -p 3000:3000 \
  --env-file ./backend/.env \
  stealth-learning-api

# Or use Docker Compose
docker-compose up -d
```

---

## 🗄️ DATABASE SETUP

### MongoDB Atlas Setup

1. **Create Cluster**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create free M0 cluster
   - Choose AWS/GCP/Azure and region

2. **Configure Access**:
   - Add database user
   - Add IP whitelist (0.0.0.0/0 for any IP)
   - Get connection string

3. **Update Environment**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stealth-learning?retryWrites=true&w=majority
   ```

### Redis Cloud Setup

1. **Create Database**:
   - Go to [Redis Cloud](https://redis.com/redis-enterprise-cloud/)
   - Create free database
   - Get connection details

2. **Update Environment**:
   ```env
   REDIS_URL=redis://default:password@redis-cloud-host:port
   ```

---

## 🔗 FRONTEND INTEGRATION

### Step 1: Create API Service

Create `src/services/api/apiClient.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### Step 2: Update Authentication Service

Create `src/services/api/authService.ts`:

```typescript
import { apiClient } from './apiClient';

export const authService = {
  async login(credentials: { username: string; password?: string; pin?: string }) {
    const response = await apiClient.post('/auth/login', credentials);
    const { accessToken, refreshToken, sessionId } = response.data.data;

    // Store tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('sessionId', sessionId);

    return response.data.data;
  },

  async register(userData: any) {
    const response = await apiClient.post('/auth/register/parent', userData);
    const { accessToken, refreshToken } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return response.data.data;
  },

  async logout() {
    await apiClient.post('/auth/logout');
    localStorage.clear();
    window.location.href = '/login';
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },
};
```

### Step 3: Update Environment Variables

Add to `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api  # Development
# VITE_API_URL=https://api.stealth-learning.app/api  # Production
```

### Step 4: Update Security Configuration

Update `src/config/security-wrapper.ts`:

```typescript
// Check if backend is available
const hasBackendAPI = Boolean(import.meta.env.VITE_API_URL);

// Update emergency config to reflect backend status
emergencySecurityConfig.API_URL = import.meta.env.VITE_API_URL || '';
emergencySecurityConfig.FEATURES.ENABLE_AUTHENTICATION = hasBackendAPI;
emergencySecurityConfig.FEATURES.ENABLE_DATA_STORAGE = hasBackendAPI;
emergencySecurityConfig.FEATURES.ENABLE_PARENT_DASHBOARD = hasBackendAPI;
```

---

## 🧪 TESTING & VERIFICATION

### Test Authentication Flow

```bash
# 1. Register Parent
curl -X POST http://localhost:3000/api/auth/register/parent \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@test.com",
    "password": "SecurePass123!",
    "firstName": "Test",
    "lastName": "Parent",
    "dateOfBirth": "1990-01-01"
  }'

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@test.com",
    "password": "SecurePass123!"
  }'

# 3. Use Access Token
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Run Backend Tests

```bash
cd backend
pnpm test
pnpm test:e2e
pnpm test:security
```

### Verify Security Headers

```bash
# Check security headers
curl -I http://localhost:3000/api/auth/login

# Should see:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# X-COPPA-Compliant: true
# Strict-Transport-Security: max-age=31536000
```

---

## 📊 MONITORING & MAINTENANCE

### Setup Monitoring

1. **Application Monitoring** (New Relic / DataDog):
   ```bash
   npm install newrelic
   # Add newrelic.js config file
   ```

2. **Error Tracking** (Sentry):
   ```bash
   npm install @sentry/node
   # Initialize in index.ts
   ```

3. **Uptime Monitoring** (UptimeRobot / Pingdom):
   - Monitor: https://api.stealth-learning.app/health
   - Alert on downtime

### Security Updates

```bash
# Check for vulnerabilities
cd backend
pnpm audit

# Update dependencies
pnpm update

# Rotate keys quarterly
pnpm run rotate-keys
```

### Backup Strategy

```bash
# MongoDB backup
mongodump --uri="mongodb+srv://..." --out=./backups

# Automated daily backups
0 2 * * * mongodump --uri=$MONGODB_URI --out=/backups/$(date +\%Y\%m\%d)
```

---

## ✅ DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All environment variables configured
- [ ] MongoDB Atlas cluster created
- [ ] Redis instance configured
- [ ] Email service configured
- [ ] Stripe account setup
- [ ] SSL certificates installed

### Deployment
- [ ] Backend deployed to cloud
- [ ] Database migrations run
- [ ] Health check endpoint responding
- [ ] Rate limiting active
- [ ] CORS configured correctly

### Post-Deployment
- [ ] Frontend connecting to backend
- [ ] Authentication working
- [ ] Parent verification emails sending
- [ ] Security headers verified
- [ ] Monitoring configured
- [ ] Backups scheduled

### Security Verification
- [ ] No hardcoded secrets
- [ ] HTTPS enforced
- [ ] Rate limiting working
- [ ] COPPA compliance active
- [ ] Audit logging enabled

---

## 🆘 TROUBLESHOOTING

### Common Issues

**1. CORS Errors**
```javascript
// Add frontend URL to ALLOWED_ORIGINS
ALLOWED_ORIGINS=http://localhost:3000,https://stealth-learning.app
```

**2. MongoDB Connection Failed**
```bash
# Check IP whitelist in Atlas
# Verify connection string format
```

**3. JWT Errors**
```bash
# Regenerate keys
openssl genrsa -out private.key 4096
openssl rsa -in private.key -pubout -out public.key
```

**4. Email Not Sending**
```bash
# Verify SendGrid API key
# Check SMTP credentials
# Test with curl
```

---

## 📞 SUPPORT

- **Documentation**: See `/backend/docs`
- **Issues**: GitHub Issues
- **Security**: security@stealth-learning.app
- **Emergency**: Use PagerDuty integration

---

## 🎉 CONGRATULATIONS!

Your backend is now:
- ✅ Fully secure with enterprise-grade encryption
- ✅ COPPA compliant with parent verification
- ✅ Protected against common attacks
- ✅ Ready for production traffic
- ✅ Scalable to millions of users

**Next Steps**:
1. Deploy to production
2. Configure monitoring
3. Run security audit
4. Launch! 🚀

---

*Last Updated: September 26, 2025*
*Version: 1.0.0*