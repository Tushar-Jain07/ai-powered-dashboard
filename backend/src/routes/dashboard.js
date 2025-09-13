const express = require('express');
const { authenticateToken /*, requireRole */ } = require('../middleware/auth'); // requireRole removed as it's not directly used here
const { logApiUsage } = require('../utils/logger');

const router = express.Router();

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Mock dashboard statistics
    const stats = {
      totalUsers: 1250,
      activeUsers: 847,
      totalRevenue: 45678,
      growthRate: 12.5,
      conversionRate: 3.24,
      averageSessionDuration: '4m 32s',
      bounceRate: 28.3,
      topCategories: [
        { name: 'Electronics', value: 15420, growth: 8.2 },
        { name: 'Clothing', value: 12350, growth: -2.1 },
        { name: 'Books', value: 8900, growth: 15.7 },
        { name: 'Home & Garden', value: 7200, growth: 5.3 }
      ],
      recentActivity: [
        {
          id: '1',
          type: 'sale',
          description: 'New sale recorded',
          amount: 1500,
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          type: 'user',
          description: 'New user registered',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ]
    };

    logApiUsage('dashboard/stats', userId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get dashboard analytics data
// @route   GET /api/dashboard/analytics
// @access  Private
router.get('/analytics', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { period = '30d', type = 'sales' } = req.query;

    // Mock analytics data based on period and type
    const generateTimeSeriesData = (period, type) => {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const data = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        let value;
        switch (type) {
          case 'sales':
            value = Math.floor(Math.random() * 10000) + 5000;
            break;
          case 'users':
            value = Math.floor(Math.random() * 100) + 50;
            break;
          case 'revenue':
            value = Math.floor(Math.random() * 50000) + 20000;
            break;
          default:
            value = Math.floor(Math.random() * 1000) + 100;
        }
        
        data.push({
          date: date.toISOString().split('T')[0],
          value,
          label: date.toLocaleDateString()
        });
      }
      
      return data;
    };

    const analytics = {
      timeSeries: generateTimeSeriesData(period, type),
      summary: {
        total: 0,
        average: 0,
        growth: Math.floor(Math.random() * 20) - 10,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      },
      breakdown: {
        byCategory: [
          { category: 'Electronics', value: 45, color: '#8884d8' },
          { category: 'Clothing', value: 25, color: '#82ca9d' },
          { category: 'Books', value: 20, color: '#ffc658' },
          { category: 'Other', value: 10, color: '#ff7300' }
        ],
        byRegion: [
          { region: 'North America', value: 40, sales: 18000 },
          { region: 'Europe', value: 30, sales: 13500 },
          { region: 'Asia', value: 20, sales: 9000 },
          { region: 'Other', value: 10, sales: 4500 }
        ]
      }
    };

    // Calculate summary values
    const values = analytics.timeSeries.map(d => d.value);
    analytics.summary.total = values.reduce((a, b) => a + b, 0);
    analytics.summary.average = Math.round(analytics.summary.total / values.length);

    logApiUsage('dashboard/analytics', userId, {
      period,
      type
    });

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get dashboard widgets configuration
// @route   GET /api/dashboard/widgets
// @access  Private
router.get('/widgets', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const widgets = [
      {
        id: 'kpi-cards',
        type: 'kpi',
        title: 'Key Performance Indicators',
        position: { x: 0, y: 0, w: 12, h: 2 },
        config: {
          cards: [
            { title: 'Total Revenue', value: '$125,430', change: 12.5, trend: 'up' },
            { title: 'Active Users', value: '2,847', change: -3.2, trend: 'down' },
            { title: 'Conversion Rate', value: '3.24%', change: 8.1, trend: 'up' },
            { title: 'Avg. Session', value: '4m 32s', change: 2.3, trend: 'up' }
          ]
        }
      },
      {
        id: 'sales-chart',
        type: 'chart',
        title: 'Sales Overview',
        position: { x: 0, y: 2, w: 8, h: 4 },
        config: {
          chartType: 'line',
          dataSource: 'sales',
          period: '30d'
        }
      },
      {
        id: 'category-breakdown',
        type: 'chart',
        title: 'Category Breakdown',
        position: { x: 8, y: 2, w: 4, h: 4 },
        config: {
          chartType: 'pie',
          dataSource: 'categories'
        }
      },
      {
        id: 'recent-activity',
        type: 'table',
        title: 'Recent Activity',
        position: { x: 0, y: 6, w: 6, h: 3 },
        config: {
          dataSource: 'activity',
          limit: 10
        }
      },
      {
        id: 'ai-chat',
        type: 'ai-chat',
        title: 'AI Assistant',
        position: { x: 6, y: 6, w: 6, h: 3 },
        config: {
          placeholder: 'Ask me about your data...'
        }
      }
    ];

    logApiUsage('dashboard/widgets', userId);

    res.json({
      success: true,
      data: {
        widgets,
        layout: 'grid'
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update dashboard widgets configuration
// @route   PUT /api/dashboard/widgets
// @access  Private
router.put('/widgets', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { widgets, layout } = req.body;

    // In a real application, you would save this to the user's preferences
    // For now, we'll just validate and return success

    if (!Array.isArray(widgets)) {
      return res.status(400).json({
        success: false,
        error: 'Widgets must be an array'
      });
    }

    logApiUsage('dashboard/update-widgets', userId, {
      widgetCount: widgets.length,
      layout
    });

    res.json({
      success: true,
      message: 'Dashboard configuration updated successfully',
      data: {
        widgets,
        layout
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get dashboard alerts
// @route   GET /api/dashboard/alerts
// @access  Private
router.get('/alerts', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const alerts = [
      {
        id: '1',
        type: 'warning',
        title: 'Low Inventory Alert',
        message: 'Electronics category is running low on stock',
        timestamp: new Date().toISOString(),
        read: false,
        action: {
          type: 'link',
          label: 'View Inventory',
          url: '/inventory'
        }
      },
      {
        id: '2',
        type: 'info',
        title: 'Monthly Report Ready',
        message: 'Your monthly analytics report is now available',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        action: {
          type: 'link',
          label: 'View Report',
          url: '/reports/monthly'
        }
      },
      {
        id: '3',
        type: 'success',
        title: 'Goal Achieved',
        message: 'You have reached 90% of your monthly sales target',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true
      }
    ];

    logApiUsage('dashboard/alerts', userId);

    res.json({
      success: true,
      data: {
        alerts,
        unreadCount: alerts.filter(alert => !alert.read).length
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Mark alert as read
// @route   PUT /api/dashboard/alerts/:id/read
// @access  Private
router.put('/alerts/:id/read', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // In a real application, you would update the alert in the database
    // For now, we'll just return success

    logApiUsage('dashboard/mark-alert-read', userId, { alertId: id });

    res.json({
      success: true,
      message: 'Alert marked as read'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get dashboard performance metrics
// @route   GET /api/dashboard/performance
// @access  Private
router.get('/performance', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const performance = {
      pageLoadTime: 1.2,
      apiResponseTime: 0.3,
      errorRate: 0.02,
      uptime: 99.9,
      lastUpdated: new Date().toISOString(),
      metrics: {
        totalRequests: 15420,
        successfulRequests: 15390,
        failedRequests: 30,
        averageResponseTime: 0.3
      }
    };

    logApiUsage('dashboard/performance', userId);

    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
