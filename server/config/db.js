const mongoose = require('mongoose');

let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  if (getIsConnected()) return true;
  if (connectionPromise) return connectionPromise;

  connectionPromise = (async () => {
    const uri = process.env.MONGODB_URI;
    const allowInMemoryFallback =
      process.env.NODE_ENV === 'development' &&
      process.env.ALLOW_IN_MEMORY_FALLBACK === 'true';

    if (!uri) {
      if (allowInMemoryFallback) {
        isConnected = false;
        console.warn('[MongoDB] MONGODB_URI is unset; using in-memory demo data by configuration.');
        return false;
      }

      throw new Error('MONGODB_URI is required unless development in-memory fallback is explicitly enabled.');
    }

    try {
      mongoose.set('strictQuery', false);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 2500,
      });
      isConnected = true;
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
      return true;
    } catch (error) {
      isConnected = false;

      if (allowInMemoryFallback) {
        console.warn(`[MongoDB] Connection failed (${error.name}); using in-memory demo data by configuration.`);
        return false;
      }

      throw new Error(
        `Could not connect to MongoDB (${error.name}). Check the private MONGODB_URI, Atlas network access, and database user permissions.`
      );
    }
  })();

  try {
    return await connectionPromise;
  } finally {
    connectionPromise = null;
  }
};

const getIsConnected = () => isConnected && mongoose.connection.readyState === 1;

module.exports = { connectDB, getIsConnected };
