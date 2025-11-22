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
  const envCheck = {
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasJwtExpire: !!process.env.JWT_EXPIRE,
    nodeEnv: process.env.NODE_ENV || 'not set',
    isVercel: process.env.VERCEL === '1',
    mongoUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
    mongoUriStartsWith: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'not set'
  };
  
  res.json({
    status: envCheck.hasMongoUri && envCheck.hasJwtSecret ? 'OK' : 'ERROR',
    environment: envCheck,
    message: envCheck.hasMongoUri 
      ? 'Environment variables are set' 
      : 'MONGODB_URI is missing - please set it in Vercel environment variables'
  });
});

// Only start server if not in Vercel serverless environment
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

