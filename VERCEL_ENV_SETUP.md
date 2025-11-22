# Vercel Environment Variables Setup Guide

## Critical: Fix "Database configuration error - check environment variables"

This error occurs when `MONGODB_URI` is not set in Vercel's environment variables.

## Step-by-Step Setup

### 1. Go to Vercel Dashboard
- Visit [vercel.com](https://vercel.com)
- Log in and select your project

### 2. Navigate to Environment Variables
- Click on your project
- Go to **Settings** tab
- Click on **Environment Variables** in the left sidebar

### 3. Add Required Environment Variables

Add these variables one by one:

#### Variable 1: MONGODB_URI
- **Key:** `MONGODB_URI`
- **Value:** `mongodb+srv://guptapratham2703:pratham123@inkle.wnlxumj.mongodb.net/social_feed?appName=Inkle`
- **Environment:** Select all (Production, Preview, Development)
- Click **Save**

#### Variable 2: JWT_SECRET
- **Key:** `JWT_SECRET`
- **Value:** `your_super_secret_jwt_key_change_this_in_production` (or generate a secure random string)
- **Environment:** Select all
- Click **Save**

#### Variable 3: JWT_EXPIRE
- **Key:** `JWT_EXPIRE`
- **Value:** `7d`
- **Environment:** Select all
- Click **Save**

#### Variable 4: NODE_ENV
- **Key:** `NODE_ENV`
- **Value:** `production`
- **Environment:** Production only
- Click **Save**

#### Variable 5: VERCEL
- **Key:** `VERCEL`
- **Value:** `1`
- **Environment:** Select all
- Click **Save**

### 4. Verify Environment Variables

After adding all variables, you should see:
- ✅ MONGODB_URI
- ✅ JWT_SECRET
- ✅ JWT_EXPIRE
- ✅ NODE_ENV (Production only)
- ✅ VERCEL

### 5. Redeploy Your Application

**IMPORTANT:** After adding/updating environment variables, you MUST redeploy:

1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the three dots (⋯) menu
4. Click **Redeploy**
5. Wait for deployment to complete

### 6. Verify Setup

After redeployment, check if it's working:

1. Visit: `https://your-app.vercel.app/api/diagnostic`
2. You should see:
   ```json
   {
     "status": "OK",
     "environment": {
       "hasMongoUri": true,
       "hasJwtSecret": true,
       ...
     }
   }
   ```

If `hasMongoUri` is `false`, the environment variable is still not set correctly.

## Troubleshooting

### Error: "Database configuration error - check environment variables"
- ✅ Check that `MONGODB_URI` is set in Vercel
- ✅ Verify the value is correct (no extra spaces)
- ✅ Make sure you selected all environments (Production, Preview, Development)
- ✅ **Redeploy after adding variables**

### Error: "Database connection failed"
- ✅ Check MongoDB Atlas Network Access (allow `0.0.0.0/0`)
- ✅ Verify MongoDB user has `readWrite` permissions
- ✅ Check connection string format

### Environment Variables Not Working
- Environment variables are only available after redeployment
- Make sure you're checking the correct environment (Production vs Preview)
- Clear browser cache and try again

## Quick Checklist

- [ ] Added `MONGODB_URI` to Vercel environment variables
- [ ] Added `JWT_SECRET` to Vercel environment variables
- [ ] Added `JWT_EXPIRE` to Vercel environment variables
- [ ] Added `NODE_ENV=production` (Production only)
- [ ] Added `VERCEL=1`
- [ ] Selected all environments for each variable
- [ ] Redeployed the application
- [ ] Checked `/api/diagnostic` endpoint
- [ ] Verified MongoDB Atlas network access

## Need Help?

If you're still getting errors:
1. Check Vercel Function Logs (Deployments → Latest → View Function Logs)
2. Visit `/api/diagnostic` to see what's missing
3. Verify MongoDB Atlas is accessible from Vercel

