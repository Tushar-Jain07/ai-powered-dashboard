const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const User = require('../models/User');
const { logApiUsage, logSecurity } = require('../utils/logger');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    if (req.user.isDemo) {
      return res.json({
        success: true,
        data: {
          _id: userId,
          name: 'Demo User',
          email: req.user.email,
          role: req.user.role,
          isDemo: true,
          preferences: {
            theme: 'light',
            notifications: {
              email: true,
              push: true
            },
            dashboard: {
              layout: {},
              widgets: ['kpi', 'chart', 'table', 'ai-chat']
            }
          }
        }
      });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    logApiUsage('user/profile', userId);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', [
  authenticateToken,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Theme must be light, dark, or auto'),
  body('preferences.notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
  body('preferences.notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notifications must be a boolean'),
  handleValidationErrors
], async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, preferences } = req.body;

    if (req.user.isDemo) {
      return res.status(403).json({
        success: false,
        error: 'Cannot update demo user profile'
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (preferences) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    logApiUsage('user/update-profile', userId, {
      updatedFields: Object.keys(updateData)
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user statistics
// @route   GET /api/user/stats
// @access  Private
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    if (req.user.isDemo) {
      return res.json({
        success: true,
        data: {
          totalDataEntries: 150,
          totalSales: 125430,
          totalProfit: 45678,
          averageProfitMargin: 36.4,
          lastLogin: new Date().toISOString(),
          accountAge: 30,
          dataEntryStreak: 7
        }
      });
    }

    // In a real application, you would calculate these from actual data
    const stats = {
      totalDataEntries: 0,
      totalSales: 0,
      totalProfit: 0,
      averageProfitMargin: 0,
      lastLogin: new Date().toISOString(),
      accountAge: 0,
      dataEntryStreak: 0
    };

    logApiUsage('user/stats', userId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all users (admin only)
// @route   GET /api/user
// @access  Private (Admin)
router.get('/', [authenticateToken, requireRole(['admin'])], async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, isActive } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    logApiUsage('user/list', req.user.id, {
      page,
      limit,
      filters: { role, isActive }
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user by ID (admin only)
// @route   GET /api/user/:id
// @access  Private (Admin)
router.get('/:id', [
  authenticateToken,
  requireRole(['admin']),
  param('id').isMongoId().withMessage('Invalid user ID'),
  handleValidationErrors
], async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    logApiUsage('user/get-by-id', req.user.id, { targetUserId: id });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user by ID (admin only)
// @route   PUT /api/user/:id
// @access  Private (Admin)
router.put('/:id', [
  authenticateToken,
  requireRole(['admin']),
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('role')
    .optional()
    .isIn(['user', 'admin', 'moderator'])
    .withMessage('Role must be user, admin, or moderator'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  handleValidationErrors
], async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;
    
    const updateData = {};
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    logSecurity('User Updated by Admin', {
      adminId: req.user.id,
      targetUserId: id,
      changes: updateData
    });

    logApiUsage('user/update-by-id', req.user.id, {
      targetUserId: id,
      updatedFields: Object.keys(updateData)
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user by ID (admin only)
// @route   DELETE /api/user/:id
// @access  Private (Admin)
router.delete('/:id', [
  authenticateToken,
  requireRole(['admin']),
  param('id').isMongoId().withMessage('Invalid user ID'),
  handleValidationErrors
], async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    logSecurity('User Deactivated by Admin', {
      adminId: req.user.id,
      targetUserId: id
    });

    logApiUsage('user/delete', req.user.id, { targetUserId: id });

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user activity log
// @route   GET /api/user/activity
// @access  Private
router.get('/activity', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // In a real application, you would have an activity log collection
    // For now, we'll return mock data
    const activityLog = [
      {
        id: '1',
        action: 'login',
        timestamp: new Date().toISOString(),
        ip: req.ip,
        userAgent: req.get('User-Agent')
      },
      {
        id: '2',
        action: 'data_entry_created',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        details: { category: 'Sales', amount: 1500 }
      }
    ];

    logApiUsage('user/activity', userId);

    res.json({
      success: true,
      data: {
        activities: activityLog,
        total: activityLog.length
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
