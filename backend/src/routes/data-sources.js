const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { logApiUsage } = require('../utils/logger');

const router = express.Router();

// @desc    Get all data sources
// @route   GET /api/data-sources
// @access  Private
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Mock data sources
    const dataSources = [
      {
        id: '1',
        name: 'Sales Database',
        type: 'database',
        status: 'connected',
        lastSync: new Date().toISOString(),
        recordCount: 15420,
        description: 'Main sales data from PostgreSQL'
      },
      {
        id: '2',
        name: 'Customer API',
        type: 'api',
        status: 'connected',
        lastSync: new Date(Date.now() - 3600000).toISOString(),
        recordCount: 8930,
        description: 'Customer data from REST API'
      },
      {
        id: '3',
        name: 'Analytics CSV',
        type: 'file',
        status: 'disconnected',
        lastSync: new Date(Date.now() - 86400000).toISOString(),
        recordCount: 0,
        description: 'Analytics data from CSV file'
      }
    ];

    logApiUsage('data-sources/list', userId);

    res.json({
      success: true,
      data: dataSources
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single data source
// @route   GET /api/data-sources/:id
// @access  Private
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Mock single data source
    const dataSource = {
      id,
      name: 'Sales Database',
      type: 'database',
      status: 'connected',
      lastSync: new Date().toISOString(),
      recordCount: 15420,
      description: 'Main sales data from PostgreSQL',
      config: {
        host: 'localhost',
        port: 5432,
        database: 'sales',
        table: 'transactions'
      },
      schema: {
        fields: [
          { name: 'id', type: 'integer', nullable: false },
          { name: 'amount', type: 'decimal', nullable: false },
          { name: 'date', type: 'timestamp', nullable: false },
          { name: 'customer_id', type: 'integer', nullable: true }
        ]
      }
    };

    logApiUsage('data-sources/get', userId, { dataSourceId: id });

    res.json({
      success: true,
      data: dataSource
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create data source
// @route   POST /api/data-sources
// @access  Private
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, type, config, description } = req.body;

    // Mock creation
    const newDataSource = {
      id: Date.now().toString(),
      name,
      type,
      status: 'connected',
      lastSync: new Date().toISOString(),
      recordCount: 0,
      description,
      config,
      createdAt: new Date().toISOString()
    };

    logApiUsage('data-sources/create', userId, { dataSourceName: name });

    res.status(201).json({
      success: true,
      data: newDataSource
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update data source
// @route   PUT /api/data-sources/:id
// @access  Private
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    // Mock update
    const updatedDataSource = {
      id,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    logApiUsage('data-sources/update', userId, { dataSourceId: id });

    res.json({
      success: true,
      data: updatedDataSource
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete data source
// @route   DELETE /api/data-sources/:id
// @access  Private
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    logApiUsage('data-sources/delete', userId, { dataSourceId: id });

    res.json({
      success: true,
      message: 'Data source deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get data from data source
// @route   GET /api/data-sources/:id/data
// @access  Private
router.get('/:id/data', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    // Mock data
    const mockData = Array.from({ length: Math.min(limit, 50) }, (_, i) => ({
      id: i + 1,
      amount: Math.floor(Math.random() * 10000) + 100,
      date: new Date(Date.now() - i * 86400000).toISOString(),
      customer_id: Math.floor(Math.random() * 1000) + 1,
      product: `Product ${i + 1}`,
      category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)]
    }));

    logApiUsage('data-sources/data', userId, { dataSourceId: id, limit, offset });

    res.json({
      success: true,
      data: {
        records: mockData,
        total: 15420,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Refresh data source
// @route   POST /api/data-sources/:id/refresh
// @access  Private
router.post('/:id/refresh', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Mock refresh
    logApiUsage('data-sources/refresh', userId, { dataSourceId: id });

    res.json({
      success: true,
      message: 'Data source refreshed successfully',
      data: {
        lastSync: new Date().toISOString(),
        recordCount: Math.floor(Math.random() * 20000) + 10000
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get data source schema
// @route   GET /api/data-sources/:id/schema
// @access  Private
router.get('/:id/schema', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Mock schema
    const schema = {
      fields: [
        { name: 'id', type: 'integer', nullable: false, description: 'Unique identifier' },
        { name: 'amount', type: 'decimal', nullable: false, description: 'Transaction amount' },
        { name: 'date', type: 'timestamp', nullable: false, description: 'Transaction date' },
        { name: 'customer_id', type: 'integer', nullable: true, description: 'Customer identifier' },
        { name: 'product', type: 'varchar', nullable: true, description: 'Product name' },
        { name: 'category', type: 'varchar', nullable: true, description: 'Product category' }
      ],
      indexes: [
        { name: 'idx_date', fields: ['date'] },
        { name: 'idx_customer', fields: ['customer_id'] }
      ]
    };

    logApiUsage('data-sources/schema', userId, { dataSourceId: id });

    res.json({
      success: true,
      data: schema
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
