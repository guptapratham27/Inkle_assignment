require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/database');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const likeRoutes = require('./routes/likeRoutes');
const followRoutes = require('./routes/followRoutes');
const activityRoutes = require('./routes/activityRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to database (lazy connection for serverless)
if (process.env.VERCEL !== '1') {
  connectDB();
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', likeRoutes);
app.use('/api/users', followRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Diagnostic endpoint to check environment variables (without exposing values)
app.get('/api/diagnostic', (req, res) => {
  try {
    // Get all environment variable keys (for debugging)
    const allEnvKeys = Object.keys(process.env).sort();
    const relevantKeys = allEnvKeys.filter(k => 
      k.includes('MONGO') || 
      k.includes('JWT') || 
      k === 'VERCEL' || 
      k === 'NODE_ENV' ||
      k.includes('DATABASE') ||
      k.includes('DB')
    );
    
    const envCheck = {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasJwtExpire: !!process.env.JWT_EXPIRE,
      nodeEnv: process.env.NODE_ENV || 'not set',
      isVercel: process.env.VERCEL === '1',
      mongoUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
      mongoUriStartsWith: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'not set',
      relevantEnvKeys: relevantKeys,
      totalEnvKeys: allEnvKeys.length,
      // Show first few chars of each relevant key's value (for debugging, but masked)
      envValues: relevantKeys.reduce((acc, key) => {
        const value = process.env[key];
        if (value) {
          acc[key] = value.length > 0 ? `${value.substring(0, 3)}... (${value.length} chars)` : 'empty';
        } else {
          acc[key] = 'not set';
        }
        return acc;
      }, {})
    };
    
    const status = envCheck.hasMongoUri && envCheck.hasJwtSecret ? 'OK' : 'ERROR';
    const message = envCheck.hasMongoUri 
      ? 'Environment variables are set correctly' 
      : 'MONGODB_URI is missing - please set it in Vercel environment variables and redeploy';
    
    res.status(status === 'OK' ? 200 : 500).json({
      status,
      environment: envCheck,
      message,
      troubleshooting: !envCheck.hasMongoUri ? {
        issue: 'Environment variables not found in serverless function',
        possibleCauses: [
          'Variables not added in Vercel Dashboard → Settings → Environment Variables',
          'Variables added but not selected for correct environment (must select Production, Preview, AND Development)',
          'Variables added but application not redeployed after adding them',
          'Variables have typos in names (must be exactly MONGODB_URI, JWT_SECRET, etc.)',
          'Variables added to wrong project'
        ],
        solution: {
          step1: 'Go to Vercel Dashboard → Your Project → Settings → Environment Variables',
          step2: 'Verify MONGODB_URI exists. If not, add it with value: mongodb+srv://guptapratham2703:pratham123@inkle.wnlxumj.mongodb.net/social_feed?appName=Inkle',
          step3: 'Verify JWT_SECRET exists. If not, add it with value: your_super_secret_jwt_key_change_this_in_production',
          step4: 'Verify JWT_EXPIRE exists. If not, add it with value: 7d',
          step5: 'For EACH variable, ensure ALL environments are selected: Production ✅ Preview ✅ Development ✅',
          step6: 'Go to Deployments tab → Click three dots (⋯) → Redeploy',
          step7: 'Wait for deployment to complete, then check this endpoint again'
        }
      } : undefined
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      message: 'Error checking environment variables',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Only start server if not in Vercel serverless environment
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

