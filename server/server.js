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
    if (!origin || FRONTEND_ORIGINS.has(origin)) {
      return callback(null, true);
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
    next();
  } catch (error) {
    next(error);
  }
});
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'MeeBhoomi AP Reference Recreation Backend API is Running',
    docs: '/api/health'
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();
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
