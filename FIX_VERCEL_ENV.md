# 🚨 URGENT: Fix "Database configuration error" on Vercel

## The Problem
You're seeing: **"Database configuration error - check environment variables"**

This means `MONGODB_URI` is **NOT SET** in your Vercel project.

## ✅ SOLUTION (Follow These Steps Exactly)

### Step 1: Open Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Log in
3. Click on your project: **inkle-assignment** (or whatever it's named)

### Step 2: Go to Environment Variables
1. Click **"Settings"** tab (top navigation)
2. Click **"Environment Variables"** in the left sidebar
3. You should see a list (might be empty)

### Step 3: Add MONGODB_URI (MOST IMPORTANT!)
1. Click **"Add New"** button
2. **Key:** Type exactly: `MONGODB_URI` (case-sensitive, no spaces)
3. **Value:** Paste this exactly:
   ```
   mongodb+srv://guptapratham2703:pratham123@inkle.wnlxumj.mongodb.net/social_feed?appName=Inkle
   ```
4. **Environment:** Check ALL THREE boxes:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
5. Click **"Save"**

### Step 4: Add JWT_SECRET
1. Click **"Add New"** again
2. **Key:** `JWT_SECRET`
3. **Value:** `your_super_secret_jwt_key_change_this_in_production`
4. **Environment:** Check ALL THREE boxes
5. Click **"Save"**

### Step 5: Add JWT_EXPIRE
1. Click **"Add New"** again
2. **Key:** `JWT_EXPIRE`
3. **Value:** `7d`
4. **Environment:** Check ALL THREE boxes
5. Click **"Save"**

### Step 6: Add VERCEL
1. Click **"Add New"** again
2. **Key:** `VERCEL`
3. **Value:** `1`
4. **Environment:** Check ALL THREE boxes
5. Click **"Save"**

### Step 7: Add NODE_ENV (Production only)
1. Click **"Add New"** again
2. **Key:** `NODE_ENV`
3. **Value:** `production`
4. **Environment:** Check ONLY **Production** (not Preview or Development)
5. Click **"Save"**

### Step 8: VERIFY Your Variables
You should now see 5 variables:
- ✅ MONGODB_URI
- ✅ JWT_SECRET
- ✅ JWT_EXPIRE
- ✅ VERCEL
- ✅ NODE_ENV

### Step 9: REDEPLOY (CRITICAL!)
**Environment variables only work after redeployment!**

1. Click **"Deployments"** tab (top navigation)
2. Find your latest deployment
3. Click the **three dots (⋯)** menu on the right
4. Click **"Redeploy"**
5. Wait for deployment to complete (2-3 minutes)

### Step 10: Test
After redeployment completes:
1. Visit: `https://inkle-assignment-chi.vercel.app/api/diagnostic`
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
3. If `hasMongoUri` is `true`, you're good! Try logging in again.

## 🔍 How to Verify Variables Are Set

### Option 1: Diagnostic Endpoint
Visit: `https://inkle-assignment-chi.vercel.app/api/diagnostic`

### Option 2: Check Vercel Logs
1. Go to **Deployments** → Latest deployment
2. Click **"View Function Logs"**
3. Look for: `"hasMongoUri": true` in the logs

## ❌ Common Mistakes

1. **Forgot to redeploy** - Variables won't work until you redeploy!
2. **Wrong environment selected** - Must select Production, Preview, AND Development
3. **Typo in variable name** - Must be exactly `MONGODB_URI` (case-sensitive)
4. **Extra spaces** - No spaces before/after the value
5. **Only set for Production** - Preview deployments also need the variables

## 🆘 Still Not Working?

If you've done all steps and it's still not working:

1. **Check Vercel Function Logs:**
   - Deployments → Latest → View Function Logs
   - Look for error messages

2. **Verify MongoDB Atlas:**
   - Go to MongoDB Atlas → Network Access
   - Make sure `0.0.0.0/0` is allowed (all IPs)

3. **Check Variable Names:**
   - In Vercel, make sure variable names match exactly (case-sensitive)
   - `MONGODB_URI` not `mongodb_uri` or `MongoDB_URI`

4. **Try a Fresh Deployment:**
   - Sometimes a fresh deployment helps
   - Push a new commit or trigger a new deployment

## 📝 Quick Checklist

- [ ] Added `MONGODB_URI` to Vercel
- [ ] Added `JWT_SECRET` to Vercel
- [ ] Added `JWT_EXPIRE` to Vercel
- [ ] Added `VERCEL=1` to Vercel
- [ ] Added `NODE_ENV=production` (Production only)
- [ ] Selected ALL environments for each variable (except NODE_ENV)
- [ ] **REDEPLOYED** after adding variables
- [ ] Checked `/api/diagnostic` endpoint
- [ ] Verified `hasMongoUri: true` in diagnostic

## 🎯 Expected Result

After completing all steps:
- ✅ No more "Database configuration error"
- ✅ Login works
- ✅ All API endpoints work
- ✅ Diagnostic endpoint shows `status: "OK"`

