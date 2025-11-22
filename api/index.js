// Load environment variables (for local development)
// In Vercel, env vars are automatically available, but dotenv helps for local testing
require('dotenv').config();

const connectDB = require('../config/database');
const app = require('../src/app');

// Endpoints that don't require database connection
const NO_DB_ENDPOINTS = ['/health', '/api/diagnostic'];

// Ensure database connection before handling requests
module.exports = async (req, res) => {
  const url = req.url || '';
  const needsDb = !NO_DB_ENDPOINTS.some(endpoint => url.startsWith(endpoint));

  // Log environment check (for debugging)
  if (!needsDb || !process.env.MONGODB_URI) {
    console.log('Environment check:', {
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
      isVercel: process.env.VERCEL === '1',
      nodeEnv: process.env.NODE_ENV,
      url: url
    });
  }

  // For diagnostic/health endpoints, skip DB connection
  if (!needsDb) {
    return app(req, res);
  }

  // For other endpoints, ensure database connection
  try {
    // Always ensure connection (cached internally by mongoose)
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Database connection error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriStartsWith: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + '...' : 'NOT SET'
    });
    
    // More specific error messages
    let errorMessage = 'Database connection failed';
    let detailedMessage = error.message;
    
    if (error.message.includes('MONGODB_URI') || !process.env.MONGODB_URI) {
      errorMessage = 'Database configuration error - check environment variables';
      detailedMessage = 'MONGODB_URI environment variable is not set in Vercel. Please add it in Settings → Environment Variables and redeploy.';
    } else if (error.message.includes('authentication failed')) {
      errorMessage = 'Database authentication failed - check credentials';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Database connection timeout - check network access';
    }
    
    return res.status(500).json({ 
      error: errorMessage,
      message: detailedMessage,
      hint: !process.env.MONGODB_URI ? 'Visit /api/diagnostic to check environment variables' : undefined
    });
  }
};

