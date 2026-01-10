# 🚀 Synexa AI Studio - Deployment Guide

## Production Deployment Options

### 1. Docker Deployment (Recommended)

#### Prerequisites
- Docker and Docker Compose installed
- Domain name configured
- SSL certificates (optional but recommended)

#### Quick Start
```bash
# Clone the repository
git clone <your-repo-url>
cd synexa

# Set environment variables
cp env.production.example .env.production
# Edit .env.production with your values

# Build and start services
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

#### Environment Variables
```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api

# Optional
ENABLE_TEST_MODE=false
FRONTEND_URL=https://your-frontend-domain.com
MOBILE_APP_URL=https://your-mobile-app-domain.com
```

### 2. Vercel Deployment (Frontend Only)

#### Prerequisites
- Vercel account
- Backend deployed separately

#### Steps
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
npm run deploy:vercel

# Set environment variables in Vercel dashboard
# NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
```

### 3. Railway/Render Deployment

#### Backend (Railway)
1. Connect GitHub repository
2. Set environment variables:
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`
   - `DATABASE_URL=file:./data/prod.db`
3. Deploy from `server` directory

#### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set environment variables:
   - `NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com`

### 4. VPS Deployment

#### Prerequisites
- Ubuntu/CentOS server
- Node.js 20+ installed
- Nginx installed
- PM2 for process management

#### Steps
```bash
# Install dependencies
sudo apt update
sudo apt install nodejs npm nginx

# Install PM2
npm install -g pm2

# Clone and setup
git clone <your-repo-url>
cd synexa

# Backend setup
cd server
npm install
npm run build
pm2 start dist/index.js --name synexa-backend

# Frontend setup
cd ..
npm install
npm run build
pm2 start npm --name synexa-frontend -- start

# Configure Nginx
sudo cp nginx.conf /etc/nginx/sites-available/synexa
sudo ln -s /etc/nginx/sites-available/synexa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Performance Optimizations

### 1. Caching
- ✅ Response caching implemented
- ✅ Static asset caching
- ✅ API endpoint caching

### 2. Compression
- ✅ Gzip compression enabled
- ✅ Image optimization
- ✅ Bundle optimization

### 3. Monitoring
- ✅ Health checks implemented
- ✅ Performance monitoring
- ✅ Error tracking ready

## Security Checklist

### Production Security
- [ ] Update CORS origins for production
- [ ] Set secure environment variables
- [ ] Enable HTTPS/SSL
- [ ] Configure rate limiting
- [ ] Set up firewall rules
- [ ] Regular security updates

### API Security
- ✅ JWT authentication
- ✅ Request validation
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Input sanitization

## Monitoring & Maintenance

### Health Checks
- Frontend: `https://your-domain.com/api/health`
- Backend: `https://your-backend.com/health`

### Logs
```bash
# Docker logs
docker-compose logs -f frontend
docker-compose logs -f backend

# PM2 logs
pm2 logs synexa-frontend
pm2 logs synexa-backend
```

### Backup
```bash
# Database backup (SQLite)
cp server/data/prod.db backup/prod-$(date +%Y%m%d).db

# Full backup
tar -czf backup/synexa-$(date +%Y%m%d).tar.gz .
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `NEXT_PUBLIC_API_BASE_URL` environment variable
   - Verify backend CORS configuration

2. **Authentication Issues**
   - Verify JWT token configuration
   - Check token expiration

3. **API Connection Issues**
   - Verify backend is running
   - Check network connectivity
   - Verify environment variables

4. **Build Errors**
   - Clear cache: `npm run clean`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run type-check`

### Performance Issues
- Check health endpoints for response times
- Monitor memory usage
- Review cache hit rates
- Analyze bundle sizes

## Support

For deployment issues:
1. Check logs first
2. Verify environment variables
3. Test health endpoints
4. Review this documentation

## Version Information

- Node.js: 20+
- Next.js: 14.2+
- Express: 4.18+
- TypeScript: 5.0+