require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getIsConnected } = require('./config/db');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const FRONTEND_ORIGINS = new Set([
  FRONTEND_URL,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  ...(process.env.NODE_ENV === 'production'
    ? []
    : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'])
].filter(Boolean));

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (FRONTEND_ORIGINS.has(origin)) return callback(null, true);

    // In development mode, allow any localhost or 127.0.0.1 port (e.g. 5173, 5174, 5175, 3000)
    if (process.env.NODE_ENV !== 'production') {
      try {
        const { hostname } = new URL(origin);
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return callback(null, true);
        }
      } catch (err) {}
    }

    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    const safePath = req.path.startsWith('/api/records/')
      ? '/api/records'
      : req.path.startsWith('/api/applications/status/')
        ? '/api/applications/status'
        : req.path;
    console.log(`[${new Date().toISOString()}] ${req.method} ${safePath}`);
    next();
  });
}

// Routes
app.use('/api', async (req, res, next) => {
  try {
    if (!getIsConnected()) {
      await connectDB();
    }
  } catch (error) {
    // Proceed with fallback data rather than blocking API requests
    console.warn(`[API] DB connection deferred: ${error.message}`);
  }
  next();
});
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'MeeBhoomi AP Reference Recreation Backend API is Running',
    docs: '/api/health'
  });
});

// Also support Vercel serverless where /api prefix may be stripped
app.use('/', apiRoutes);

// Centralized Error Handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.warn(`[Startup] MongoDB connection warning: ${error.message}`);
  }
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`MeeBhoomi Backend Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`API base:     http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error(`[Startup] ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = app;
