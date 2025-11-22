const connectDB = require('../config/database');
const app = require('../src/app');

// Ensure database connection before handling requests
module.exports = async (req, res) => {
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
      hasMongoUri: !!process.env.MONGODB_URI
    });
    
    // More specific error messages
    let errorMessage = 'Database connection failed';
    if (error.message.includes('MONGODB_URI')) {
      errorMessage = 'Database configuration error - check environment variables';
    } else if (error.message.includes('authentication failed')) {
      errorMessage = 'Database authentication failed - check credentials';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Database connection timeout - check network access';
    }
    
    return res.status(500).json({ 
      error: errorMessage,
      message: process.env.NODE_ENV === 'production' ? 'Please check server configuration' : error.message
    });
  }
};

