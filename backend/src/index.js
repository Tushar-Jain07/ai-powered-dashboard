require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
const morgan = require('morgan');

// Import middleware
const { securityMiddleware, corsOptions, generalLimiter, authLimiter, chatLimiter } = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');
const { httpLogger, logError, logSecurity } = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/user');
const dashboardRoutes = require('./routes/dashboard');

// Initialize OpenAI only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('✅ OpenAI initialized successfully');
} else {
  console.warn('⚠️  OpenAI API key not configured - AI features will be disabled');
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.warn('⚠️  MONGODB_URI not set - using in-memory data store');
      return;
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Create Express app
const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(securityMiddleware);

// CORS
app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ 
  limit: process.env.MAX_FILE_SIZE || '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: process.env.MAX_FILE_SIZE || '10mb' 
}));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
  app.use(httpLogger);
}

// Rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/chat/', chatLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      openai: openai ? 'configured' : 'not configured'
    }
  };
  
  try {
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = 'ERROR';
    res.status(503).json(healthCheck);
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  // Close server
  if (server) {
    server.close(() => {
      console.log('✅ HTTP server closed');
      
      // Close database connection
      mongoose.connection.close(false, () => {
        console.log('✅ MongoDB connection closed');
        process.exit(0);
      });
    });
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  logError(error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  logError(new Error(`Unhandled Rejection: ${reason}`));
  process.exit(1);
});

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const PORT = process.env.PORT || 5005;
const server = app.listen(PORT, () => {
  console.log(`
🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
📡 Server listening on port ${PORT}
🌐 Health check: http://localhost:${PORT}/api/health
📊 API docs: http://localhost:${PORT}/api/test
  `);
});

// Export for Vercel serverless function
module.exports = app;