# Production Deployment Guide

This guide covers deploying the AI-Powered Dashboard to production environments.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- OpenAI API key
- Domain name (for production)
- SSL certificate (for HTTPS)

### Environment Setup

1. **Backend Environment Variables:**
   ```bash
   # Copy example file
   cp backend/env.example backend/.env
   
   # Edit with your values
   nano backend/.env
   ```

   Required variables:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-dashboard
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   OPENAI_API_KEY=your-openai-api-key
   NODE_ENV=production
   ALLOWED_ORIGINS=https://yourdomain.com
   ```

2. **Frontend Environment Variables:**
   ```bash
   # Copy example file
   cp frontend/env.example frontend/.env
   
   # Edit with your values
   nano frontend/.env
   ```

   Required variables:
   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com
   VITE_APP_NAME=AI-Powered Dashboard
   VITE_APP_VERSION=1.0.0
   ```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Clone and setup:**
   ```bash
   git clone <your-repo>
   cd ai-powered-dashboard
   ```

2. **Configure environment:**
   ```bash
   # Copy and edit environment files
   cp backend/env.example backend/.env
   cp frontend/env.example frontend/.env
   ```

3. **Start services:**
   ```bash
   docker-compose up -d
   ```

4. **Check status:**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

### Manual Docker Build

1. **Build backend:**
   ```bash
   cd backend
   docker build -t ai-dashboard-backend .
   docker run -d -p 5005:5005 --env-file .env ai-dashboard-backend
   ```

2. **Build frontend:**
   ```bash
   cd frontend
   docker build -t ai-dashboard-frontend .
   docker run -d -p 3000:80 ai-dashboard-frontend
   ```

## ☁️ Cloud Deployment

### Vercel (Recommended for Frontend)

1. **Connect repository to Vercel**
2. **Set environment variables in Vercel dashboard:**
   - `VITE_API_BASE_URL`
   - `VITE_APP_NAME`
   - `VITE_APP_VERSION`

3. **Deploy automatically on push**

### Railway

1. **Connect GitHub repository**
2. **Set environment variables**
3. **Deploy automatically**

### DigitalOcean App Platform

1. **Create new app from GitHub**
2. **Configure build settings:**
   - Frontend: Build command `npm run build`, Output directory `dist`
   - Backend: Build command `npm install`, Start command `npm start`

3. **Set environment variables**
4. **Deploy**

### AWS/GCP/Azure

1. **Use container services (ECS, Cloud Run, Container Instances)**
2. **Set up load balancers**
3. **Configure auto-scaling**
4. **Set up monitoring and logging**

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create cluster on MongoDB Atlas**
2. **Set up database user**
3. **Configure network access (IP whitelist)**
4. **Get connection string**
5. **Update `MONGODB_URI` in environment**

### Self-hosted MongoDB

1. **Install MongoDB on server**
2. **Configure authentication**
3. **Set up replication (for production)**
4. **Configure backups**

## 🔒 Security Configuration

### SSL/TLS Setup

1. **Obtain SSL certificate (Let's Encrypt recommended)**
2. **Configure reverse proxy (Nginx/Apache)**
3. **Redirect HTTP to HTTPS**
4. **Set security headers**

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5005;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## 📊 Monitoring & Logging

### Application Monitoring

1. **Set up health checks:**
   - Frontend: `GET /health`
   - Backend: `GET /api/health`

2. **Configure monitoring services:**
   - Uptime monitoring (UptimeRobot, Pingdom)
   - Application monitoring (New Relic, DataDog)
   - Error tracking (Sentry, Bugsnag)

### Logging

1. **Backend logs:** Stored in `backend/logs/`
2. **Frontend logs:** Browser console + error tracking
3. **Server logs:** System logs + reverse proxy logs

### Performance Monitoring

1. **Set up performance monitoring**
2. **Configure alerts for:**
   - High response times
   - Error rates
   - Memory usage
   - CPU usage

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 Backup & Recovery

### Database Backups

1. **MongoDB Atlas:** Automatic backups enabled
2. **Self-hosted:** Set up automated backups
3. **Test restore procedures regularly**

### Application Backups

1. **Code:** Git repository
2. **Configuration:** Environment variables
3. **Assets:** Static files and uploads

## 📈 Scaling

### Horizontal Scaling

1. **Load balancer setup**
2. **Multiple backend instances**
3. **Database clustering**
4. **CDN for static assets**

### Vertical Scaling

1. **Increase server resources**
2. **Optimize database queries**
3. **Implement caching (Redis)**
4. **Optimize frontend bundle size**

## 🔧 Maintenance

### Regular Tasks

1. **Update dependencies**
2. **Monitor security advisories**
3. **Review and rotate secrets**
4. **Clean up old logs**
5. **Monitor disk space**

### Updates

1. **Test updates in staging**
2. **Deploy during maintenance windows**
3. **Monitor after deployment**
4. **Rollback plan ready**

## 📞 Support

### Troubleshooting

1. **Check logs first**
2. **Verify environment variables**
3. **Test database connectivity**
4. **Check network connectivity**
5. **Verify SSL certificates**

### Common Issues

1. **CORS errors:** Check `ALLOWED_ORIGINS`
2. **Database connection:** Verify `MONGODB_URI`
3. **Authentication issues:** Check `JWT_SECRET`
4. **AI features not working:** Verify `OPENAI_API_KEY`

## 📋 Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Database setup and tested
- [ ] SSL certificate installed
- [ ] Security headers configured
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Health checks working
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained on deployment process

## 🎯 Post-deployment

1. **Monitor application health**
2. **Check error rates**
3. **Verify all features working**
4. **Monitor performance metrics**
5. **Update documentation**
6. **Notify stakeholders**

---

For additional support, refer to the individual README files in the `backend/` and `frontend/` directories.
