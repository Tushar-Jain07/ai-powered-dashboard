const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    
    // In production, verify user still exists
    if (process.env.NODE_ENV === 'production') {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }
      req.user = user;
    } else {
      // For development, use decoded token data
      req.user = decoded;
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Check user roles
const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const userRole = req.user.role || 'user';
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Insufficient permissions'
    });
  };
};

// Check if user owns resource
const requireOwnership = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Admin users can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    if (resourceUserId && resourceUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this resource'
      });
    }

    next();
  };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
      
      if (process.env.NODE_ENV === 'production') {
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
        }
      } else {
        req.user = decoded;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret');
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireOwnership,
  optionalAuth,
  generateToken,
  verifyRefreshToken
};
