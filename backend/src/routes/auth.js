const express = require('express');
// const bcrypt = require('bcryptjs'); // Removed as it's not directly used here
const { body } = require('express-validator');
const { authenticateToken, generateToken /*, requireRole */ } = require('../middleware/auth'); // requireRole removed as it's not directly used here
const { validateLogin, validateRegistration, handleValidationErrors } = require('../middleware/validation');
const User = require('../models/User');
const { logSecurity, logApiUsage } = require('../utils/logger');

const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateRegistration, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    await user.save();

    // Generate token
    const token = generateToken({ 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });

    // Log security event
    logSecurity('User Registration', {
      userId: user._id,
      email: user.email,
      ip: req.ip
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Demo account for portfolio visitors
    if (email === 'demo@ai-dashmind.com' && password === 'demo123') {
      const token = generateToken({ 
        id: 'demo-user-1', 
        email, 
        role: 'admin', 
        isDemo: true 
      });
      
      logSecurity('Demo Login', {
        email,
        ip: req.ip
      });

      return res.json({
        success: true,
        data: {
          token,
          user: {
            _id: 'demo-user-1',
            name: 'Demo User',
            email,
            role: 'admin',
            isDemo: true
          }
        }
      });
    }

    // Find user by email
    const user = await User.findByEmail(email).select('+password');
    if (!user) {
      logSecurity('Failed Login - User Not Found', {
        email,
        ip: req.ip
      });
      
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      logSecurity('Failed Login - Account Locked', {
        userId: user._id,
        email,
        ip: req.ip
      });
      
      return res.status(423).json({
        success: false,
        error: 'Account is temporarily locked due to too many failed login attempts'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      logSecurity('Failed Login - Inactive Account', {
        userId: user._id,
        email,
        ip: req.ip
      });
      
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      logSecurity('Failed Login - Invalid Password', {
        userId: user._id,
        email,
        ip: req.ip,
        loginAttempts: user.loginAttempts + 1
      });
      
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({ 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });

    // Log successful login
    logSecurity('Successful Login', {
      userId: user._id,
      email,
      ip: req.ip
    });

    logApiUsage('auth/login', user._id, {
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const { id, email, role, isDemo } = req.user;
    
    if (isDemo) {
      return res.json({
        success: true,
        data: {
          _id: id,
          name: 'Demo User',
          email,
          role,
          isDemo: true
        }
      });
    }

    // In production, fetch fresh user data
    if (process.env.NODE_ENV === 'production') {
      const user = await User.findById(id).select('-password');
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      return res.json({
        success: true,
        data: user
      });
    }

    // For development, use token data
    res.json({
      success: true,
      data: {
        _id: id,
        name: 'Demo User',
        email,
        role,
        isDemo: false
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
router.post('/refresh', authenticateToken, async (req, res, next) => {
  try {
    const { id, email, role } = req.user;
    
    // Generate new token
    const token = generateToken({ id, email, role });
    
    res.json({
      success: true,
      data: { token }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', authenticateToken, async (req, res, next) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just log the logout event
    
    logSecurity('User Logout', {
      userId: req.user.id,
      email: req.user.email,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', [
  authenticateToken,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  handleValidationErrors
], async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;

    // Find user with password
    const user = await User.findById(id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      logSecurity('Failed Password Change - Invalid Current Password', {
        userId: id,
        ip: req.ip
      });
      
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logSecurity('Password Changed', {
      userId: id,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
