# Vercel Deployment Troubleshooting Guide

## Common Errors and Solutions

### Error: 404 NOT_FOUND

**Cause:** Vercel can't find the frontend build or routing is incorrect.

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings
2. **Build & Development Settings:**
   - Framework Preset: **Other**
   - Root Directory: **(leave empty)**
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm install && cd frontend && npm install`
3. Save and Redeploy

---

### Error: Serverless Function Crashed

**Cause:** Database connection issues or missing environment variables.

**Solution:**

1. **Check Environment Variables:**
   Go to Vercel → Settings → Environment Variables
   
   Add these (if not already set):
   ```
   MONGODB_URI=mongodb+srv://guptapratham2703:pratham123@inkle.wnlxumj.mongodb.net/?appName=Inkle
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   NODE_ENV=production
   VERCEL=1
   ```

2. **Check MongoDB Atlas:**
   - Go to MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (allow from anywhere)
   - Save

3. **Check Function Logs:**
   - Vercel Dashboard → Deployments → Click deployment → View Function Logs
   - Look for specific error messages

---

### Error: Cannot find module

**Cause:** Dependencies not installed correctly.

**Solution:**
1. Ensure `package.json` has all dependencies
2. Check Install Command in Vercel settings
3. Redeploy

---

## Step-by-Step Vercel Configuration

### 1. Project Settings

**General:**
- Root Directory: (empty)
- Framework Preset: Other

**Build & Development:**
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/dist`
- Install Command: `npm install && cd frontend && npm install`

### 2. Environment Variables

Add all these in Vercel Dashboard → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://guptapratham2703:pratham123@inkle.wnlxumj.mongodb.net/?appName=Inkle
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=production
VERCEL=1
```

### 3. Redeploy

After making changes:
- Go to Deployments tab
- Click three dots (⋯) on latest deployment
- Click **Redeploy**

---

## Alternative: Deploy Backend Separately (Recommended)

Vercel serverless functions can have issues with MongoDB connections. Consider deploying backend separately:

### Option A: Railway (Easiest)

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository
4. Add environment variables (same as above)
5. Deploy
6. Get backend URL (e.g., `https://your-app.railway.app`)

Then update frontend:
- In Vercel, add environment variable:
  ```
  VITE_API_URL=https://your-app.railway.app/api
  ```

### Option B: Render

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
5. Add environment variables
6. Deploy

---

## Testing After Deployment

1. **Health Check:**
   ```
   https://inkle-assignment-five.vercel.app/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running"}`

2. **Frontend:**
   ```
   https://inkle-assignment-five.vercel.app/
   ```
   Should show the React app

3. **API Test:**
   ```
   POST https://inkle-assignment-five.vercel.app/api/auth/signup
   ```
   Should create a user

---

## Still Having Issues?

1. **Check Vercel Logs:**
   - Dashboard → Deployments → Click deployment → View Function Logs
   - Look for specific error messages

2. **Verify Build:**
   - Check if `frontend/dist` folder exists after build
   - Verify `index.html` is in dist folder

3. **Test Locally:**
   ```bash
   # Build frontend
   cd frontend && npm run build
   
   # Check if dist folder was created
   ls -la frontend/dist
   ```

4. **Contact Support:**
   - Share Vercel function logs
   - Share error messages
   - Share deployment configuration

---

## Quick Checklist

- [ ] Environment variables set in Vercel
- [ ] Build Command: `cd frontend && npm install && npm run build`
- [ ] Output Directory: `frontend/dist`
- [ ] MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- [ ] All dependencies in package.json
- [ ] Redeployed after changes
- [ ] Checked function logs for errors

