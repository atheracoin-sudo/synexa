# Deployment Guide - Vercel via GitHub

## ✅ Pre-Deployment Checklist

### Security ✅
- [x] No API keys committed to repository
- [x] .gitignore includes .env files
- [x] OPENAI_API_KEY only read from environment variables
- [x] No NEXT_PUBLIC_OPENAI_API_KEY usage found

### Build Process ✅
- [x] `npm run build` completes successfully
- [x] All TypeScript errors resolved
- [x] All import/export issues fixed
- [x] Production-safe configuration verified

### Configuration ✅
- [x] API routes use Node.js runtime (not Edge)
- [x] Environment-aware URLs (localhost vs production)
- [x] Proper error handling for missing API keys
- [x] Vercel configuration optimized

## 🚀 Deployment Steps

### 1. Commit and Push Changes

```bash
# Check current status
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: Add premium features, billing UI, and code studio

- Add Code page with file browser and editor
- Implement premium plans (Free/Pro/Team) with billing UI
- Add feature gating with upgrade modals
- Fix notification panel overlay positioning
- Improve chat UI contrast and readability
- Add comprehensive premium state management
- Include mock checkout flow with plan activation"

# Push to GitHub
git push origin main
```

### 2. Vercel Environment Variables

In your Vercel dashboard, set these environment variables:

#### Required Variables
```
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
NODE_ENV=production
```

#### Optional Variables (for backend integration)
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

### 3. Vercel Dashboard Setup

1. **Go to Vercel Dashboard** → Your Project
2. **Settings** → **Environment Variables**
3. **Add Variable**: `OPENAI_API_KEY`
   - Value: Your actual OpenAI API key
   - Environment: Production, Preview, Development
4. **Add Variable**: `NODE_ENV`
   - Value: `production`
   - Environment: Production
5. **Save Changes**

### 4. Trigger Deployment

#### Option A: Automatic (Recommended)
- Push to GitHub main branch
- Vercel automatically detects and deploys

#### Option B: Manual
- Go to Vercel Dashboard → Deployments
- Click "Redeploy" on latest deployment
- Select "Use existing Build Cache" for faster deployment

### 5. Post-Deployment Verification

After deployment completes:

1. **Health Check**: Visit `/api/health`
   - Should return 200 status
   - Check `ai.configured: true`
   - Verify no API key errors

2. **Chat Functionality**: Test `/chat`
   - Send a test message
   - Verify AI responses work
   - Check browser console for errors

3. **Premium Features**: Test `/billing`
   - View plan cards
   - Test upgrade flow
   - Verify feature gating works

4. **Code Studio**: Test `/code`
   - Check file browser
   - Test editor functionality
   - Verify export features

## 🔧 Environment Configuration Details

### Production Environment Variables

```bash
# Required for AI functionality
OPENAI_API_KEY=sk-proj-your-key-here

# Optional - App configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com

# Automatic - Set by Vercel
NODE_ENV=production
VERCEL=1
VERCEL_URL=your-deployment-url.vercel.app
```

### API Key Security
- ✅ API key is server-side only (`OPENAI_API_KEY`)
- ✅ No client-side exposure (`NEXT_PUBLIC_*`)
- ✅ Proper error handling for missing keys
- ✅ Key validation on startup

### Error Handling
The app includes comprehensive error handling:
- Missing API key → Clear error message
- API failures → User-friendly messages
- Network issues → Retry mechanisms
- Rate limiting → Proper status codes

## 🐛 Troubleshooting

### Common Issues

#### 1. "OpenAI API key is not configured"
**Solution**: Add `OPENAI_API_KEY` to Vercel environment variables

#### 2. Build fails with TypeScript errors
**Solution**: Run `npm run build` locally first to catch issues

#### 3. API routes timeout
**Solution**: Check Vercel function timeout settings (currently 60s)

#### 4. CORS errors
**Solution**: Verify `NEXT_PUBLIC_APP_URL` matches your domain

### Debug Steps

1. **Check Vercel Function Logs**
   - Go to Vercel Dashboard → Functions
   - Click on failing function
   - Review error logs

2. **Test API Endpoints**
   ```bash
   # Health check
   curl https://your-domain.vercel.app/api/health
   
   # Should return JSON with status info
   ```

3. **Browser Console**
   - Open Developer Tools
   - Check Console tab for errors
   - Look for network request failures

## 📊 Performance Optimization

### Current Optimizations
- ✅ Static page generation where possible
- ✅ Code splitting and lazy loading
- ✅ Optimized bundle sizes
- ✅ Proper caching headers
- ✅ Image optimization ready

### Bundle Analysis
```bash
# Analyze bundle size
npm run build:analyze
```

### Performance Monitoring
- First Load JS: ~87.4 kB (excellent)
- Largest pages: Profile (139 kB), Goals (132 kB)
- API routes: Optimized with proper timeouts

## 🔒 Security Features

### Headers (vercel.json)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Content Security Policy
- Configured in middleware.ts
- Allows necessary resources
- Blocks unsafe inline scripts

### API Security
- Rate limiting implemented
- Input validation on all routes
- Proper error messages (no sensitive info)
- CORS configuration

## 🎯 Success Criteria

Your deployment is successful when:
- [ ] Build completes without errors
- [ ] Health endpoint returns 200
- [ ] Chat messages work with AI responses
- [ ] Premium features display correctly
- [ ] No console errors in browser
- [ ] All pages load properly
- [ ] Mobile responsiveness works

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints directly
4. Review browser console errors
5. Compare with working localhost version

## 🚀 Quick Deploy Command

```bash
# One-liner for quick deployment
git add . && git commit -m "Deploy: Ready for production" && git push origin main
```

Your project is now ready for production deployment on Vercel! 🎉