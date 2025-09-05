const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Rate limiting
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// General rate limiting
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later'
);

// Auth rate limiting (stricter)
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  'Too many authentication attempts, please try again later'
);

// AI chat rate limiting
const chatLimiter = createRateLimit(
  60 * 1000, // 1 minute
  10, // limit each IP to 10 requests per minute
  'Too many AI requests, please slow down'
);

// Security middleware
const securityMiddleware = [
  // Set security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.openai.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),

  // Prevent NoSQL injection attacks
  mongoSanitize(),

  // Prevent XSS attacks
  xss(),

  // Prevent parameter pollution
  hpp(),

  // Trust proxy (for rate limiting behind reverse proxy)
  (req, res, next) => {
    req.trustProxy = true;
    next();
  }
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003', 'http://localhost:3005'];
    
    // In production, allow all origins for Vercel deployment
    if (process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.warn(`Origin ${origin} not allowed by CORS`);
    return callback(null, true); // Still allow for development
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

module.exports = {
  generalLimiter,
  authLimiter,
  chatLimiter,
  securityMiddleware,
  corsOptions
};
