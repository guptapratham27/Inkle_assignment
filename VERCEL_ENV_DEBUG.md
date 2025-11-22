# 🔍 Debugging Vercel Environment Variables

## Current Status
Based on the diagnostic endpoint, only these environment variables are present:
- ✅ `VERCEL` = "1"
- ✅ `NODE_ENV` = "production"
- ❌ `MONGODB_URI` = **MISSING**
- ❌ `JWT_SECRET` = **MISSING**
- ❌ `JWT_EXPIRE` = **MISSING**

## Why This Happens

### Common Causes:
1. **Variables not added in Vercel Dashboard** - Most common issue
2. **Wrong environment selected** - Variables must be available for Production, Preview, AND Development
3. **Not redeployed** - Variables only take effect after redeployment
4. **Typo in variable name** - Must be exactly `MONGODB_URI` (case-sensitive)
5. **Added to wrong project** - Make sure you're adding to the correct Vercel project

## Step-by-Step Fix

### 1. Verify You're in the Right Project
- Go to Vercel Dashboard
- Make sure you're looking at the project that matches your deployment URL
- Your URL: `inkle-assignment-chi.vercel.app` or `inkle-assignment-five.vercel.app`

### 2. Check Current Environment Variables
1. Go to: **Settings** → **Environment Variables**
2. Take a screenshot or note what variables you see
3. If you see variables but they're not working, check:
   - Are they selected for **all environments**? (Production ✅ Preview ✅ Development ✅)
   - Do the names match exactly? (case-sensitive)

### 3. Add Missing Variables

#### Add MONGODB_URI:
```
Key: MONGODB_URI
Value: mongodb+srv://guptapratham2703:pratham123@inkle.wnlxumj.mongodb.net/social_feed?appName=Inkle
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Add JWT_SECRET:
```
Key: JWT_SECRET
Value: your_super_secret_jwt_key_change_this_in_production
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Add JWT_EXPIRE:
```
Key: JWT_EXPIRE
Value: 7d
Environments: ✅ Production ✅ Preview ✅ Development
```

### 4. CRITICAL: Redeploy
After adding variables:
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **three dots (⋯)** → **Redeploy**
4. Wait 2-3 minutes for completion

### 5. Verify
After redeployment:
1. Visit: `https://inkle-assignment-chi.vercel.app/api/diagnostic`
2. Check the response:
   - `hasMongoUri` should be `true`
   - `hasJwtSecret` should be `true`
   - `status` should be `"OK"`

## If Still Not Working

### Check Vercel Function Logs:
1. Go to **Deployments** → Latest deployment
2. Click **"View Function Logs"**
3. Look for:
   - `Environment check:` logs
   - Any error messages
   - What environment variables are actually present

### Verify Variable Names:
In Vercel Dashboard, the variable names must be:
- `MONGODB_URI` (not `mongodb_uri`, `MongoDB_URI`, or `MONGODB_URI ` with space)
- `JWT_SECRET` (not `jwt_secret` or `Jwt_Secret`)
- `JWT_EXPIRE` (not `jwt_expire`)

### Check Environment Selection:
For each variable, you should see:
- ✅ Production
- ✅ Preview
- ✅ Development

If only one is checked, that's the problem!

### Try Manual Redeploy:
1. Make a small change to any file (add a comment)
2. Commit and push to trigger a new deployment
3. This ensures a fresh build with environment variables

## Alternative: Check via Vercel CLI

If you have Vercel CLI installed:
```bash
vercel env ls
```

This will show all environment variables for your project.

## Still Stuck?

If you've done everything above and it's still not working:
1. Check if you have multiple Vercel projects
2. Verify the project name matches your deployment URL
3. Try creating a new deployment from a fresh commit
4. Contact Vercel support with your project URL and the diagnostic endpoint output

