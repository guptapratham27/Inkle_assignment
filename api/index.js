const connectDB = require('../config/database');
const app = require('../src/app');

// Connect to database on first request (serverless optimization)
let dbConnected = false;

module.exports = async (req, res) => {
  // Connect to database on first request
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('Database connection error:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  
  return app(req, res);
};

