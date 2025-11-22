# Vercel Deployment Setup Guide

## Current Issue: 404 NOT_FOUND

The 404 error occurs because Vercel needs proper configuration for both frontend and backend.

## Recommended Solution: Deploy Separately

### Option 1: Deploy Frontend to Vercel, Backend to Railway/Render (Recommended)

**Why?** Vercel serverless functions have limitations with MongoDB connections and cold starts.

#### Step 1: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository
4. Set Root Directory to: `/` (root)
5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://guptapratham2703:pratham123@inkle.wnlxumj.mongodb.net/?appName=Inkle
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   PORT=3000
   ```
6. Deploy
7. Get your backend URL (e.g., `https://your-backend.railway.app`)

#### Step 2: Deploy Frontend to Vercel

1. In Vercel Dashboard:
   - New Project → Import from GitHub
   - Select your repository
   - **Root Directory:** Set to `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```

3. Deploy

---

### Option 2: Deploy Both to Vercel (Current Setup)

If you want to keep everything on Vercel:

#### In Vercel Project Settings:

1. **General Settings:**
   - Root Directory: Leave empty (or set to project root)

2. **Build & Development Settings:**
   - Framework Preset: Other
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm install && cd frontend && npm install`

3. **Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://guptapratham2703:pratham123@inkle.wnlxumj.mongodb.net/?appName=Inkle
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   NODE_ENV=production
   VERCEL=1
   ```

4. **Redeploy** after setting these

---

## Quick Fix for Current 404 Error

1. Go to Vercel Dashboard → Your Project → Settings
2. Check **Root Directory** - should be empty or `/`
3. Go to **Build & Development Settings:**
   - Override: Yes
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm install && cd frontend && npm install`
4. Save and Redeploy

---

## Verify Deployment

After deployment, test:
- Frontend: `https://inkle-assignment-five.vercel.app/`
- API Health: `https://inkle-assignment-five.vercel.app/api/health`
- API Test: `https://inkle-assignment-five.vercel.app/api/auth/signup`

---

## Troubleshooting

### Still getting 404?

1. **Check Vercel Logs:**
   - Dashboard → Deployments → Click deployment → View Function Logs

2. **Verify Build Output:**
   - Check if `frontend/dist` folder exists after build
   - Verify `index.html` is in the dist folder

3. **Check Environment Variables:**
   - All required variables are set
   - No typos in variable names

4. **MongoDB Connection:**
   - Ensure MongoDB Atlas allows connections from Vercel IPs
   - Network Access: Add `0.0.0.0/0` (allow from anywhere)

---

## Alternative: Use Vercel CLI

```bash
npm i -g vercel
cd /path/to/project
vercel
```

Follow the prompts to configure deployment.

