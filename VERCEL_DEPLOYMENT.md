# Vercel Deployment Guide

## Issue: Serverless Function Crashed

The error occurs because Vercel needs proper configuration for Express.js backend and environment variables.

## Solution Steps

### 1. Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

**Required Environment Variables:**
```
MONGODB_URI=mongodb+srv://guptapratham2703:pratham123@inkle.wnlxumj.mongodb.net/?appName=Inkle
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=production
VERCEL=1
```

**For Frontend (if deploying separately):**
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

### 2. Deployment Options

#### Option A: Deploy Backend and Frontend Together (Current Setup)

1. The `vercel.json` is configured to handle both
2. Make sure all environment variables are set in Vercel dashboard
3. Redeploy the project

#### Option B: Deploy Backend Separately (Recommended)

**Backend Deployment:**
1. Deploy backend to Vercel (or Railway/Render)
2. Get the backend URL (e.g., `https://your-backend.vercel.app`)

**Frontend Deployment:**
1. Update `frontend/.env.production` with your backend URL
2. Deploy frontend to Vercel
3. Set `VITE_API_URL` environment variable in Vercel

### 3. Alternative: Deploy Backend to Railway/Render

Since MongoDB connections can be tricky with Vercel serverless functions, consider deploying the backend separately:

**Railway:**
1. Connect your GitHub repo
2. Set environment variables
3. Deploy

**Render:**
1. Create a new Web Service
2. Connect GitHub repo
3. Set environment variables
4. Deploy

### 4. Verify Deployment

After deployment:
1. Check backend health: `https://your-app.vercel.app/api/health`
2. Test API endpoints
3. Verify frontend can connect to backend

## Troubleshooting

### If serverless function still crashes:

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Your Project → Deployments → View Function Logs

2. **Common Issues:**
   - Missing environment variables
   - MongoDB connection timeout (serverless functions have cold starts)
   - Missing dependencies in package.json

3. **MongoDB Connection:**
   - Ensure MongoDB Atlas allows connections from Vercel IPs (0.0.0.0/0)
   - Check MongoDB connection string is correct

4. **Update vercel.json if needed:**
   - Ensure `api/index.js` properly exports the Express app
   - Check build configuration

## Quick Fix Commands

After setting environment variables in Vercel, redeploy:

```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push
```

Vercel will automatically redeploy with the new configuration.

