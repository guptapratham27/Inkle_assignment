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
      stack: error.stack
    });
    return res.status(500).json({ 
      error: 'Database connection failed',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

