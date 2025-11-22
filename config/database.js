const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Return existing connection if available and ready
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Check if connection is already in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.trim() === '') {
      const error = new Error('MONGODB_URI is not defined in environment variables');
      console.error('Database config error:', error.message);
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('VERCEL')));
      throw error;
    }

    // Ensure database name is in the connection string
    let mongoUri = process.env.MONGODB_URI;
    if (!mongoUri.includes('/?') && !mongoUri.match(/\/[^?]+(\?|$)/)) {
      mongoUri = mongoUri.replace(/\?/, '/social_feed?');
    }

    cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      console.log('Database:', mongoose.connection.db.databaseName);
      return mongoose;
    }).catch((error) => {
      cached.promise = null;
      console.error('MongoDB connection error:', error.message);
      console.error('Connection string (masked):', mongoUri.replace(/:[^:@]+@/, ':****@'));
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;

