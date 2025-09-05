const express = require('express');
const { authenticateToken, requireRole, requireOwnership } = require('../middleware/auth');
const { validateDataEntry, validateBulkDataEntry, validateId, validatePagination, handleValidationErrors } = require('../middleware/validation');
const DataEntry = require('../models/DataEntry');
const { logApiUsage, logError } = require('../utils/logger');

const router = express.Router();

// @desc    Get user's data entries
// @route   GET /api/data
// @access  Private
router.get('/', [authenticateToken, validatePagination], async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 20,
      sort = '-date',
      category,
      startDate,
      endDate,
      minSales,
      maxSales,
      minProfit,
      maxProfit
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      category,
      startDate,
      endDate,
      minSales: minSales ? parseFloat(minSales) : undefined,
      maxSales: maxSales ? parseFloat(maxSales) : undefined,
      minProfit: minProfit ? parseFloat(minProfit) : undefined,
      maxProfit: maxProfit ? parseFloat(maxProfit) : undefined
    };

    const entries = await DataEntry.getUserEntries(userId, options);
    
    // Get total count for pagination
    const totalCount = await DataEntry.countDocuments({ 
      userId, 
      isActive: true 
    });

    logApiUsage('data/get', userId, {
      page,
      limit,
      filters: { category, startDate, endDate }
    });

    res.json({
      success: true,
      data: {
        entries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single data entry
// @route   GET /api/data/:id
// @access  Private
router.get('/:id', [authenticateToken, validateId], async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const entry = await DataEntry.findOne({ 
      _id: id, 
      userId, 
      isActive: true 
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Data entry not found'
      });
    }

    logApiUsage('data/get-single', userId, { entryId: id });

    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new data entry
// @route   POST /api/data
// @access  Private
router.post('/', [authenticateToken, validateDataEntry], async (req, res, next) => {
  try {
    const { date, sales, profit, category, description, tags } = req.body;
    const userId = req.user.id;

    const entry = new DataEntry({
      date: new Date(date),
      sales: parseFloat(sales),
      profit: parseFloat(profit),
      category: category.trim().toLowerCase(),
      description: description?.trim(),
      tags: tags || [],
      userId,
      metadata: {
        source: 'manual',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    await entry.save();

    logApiUsage('data/create', userId, {
      category,
      sales,
      profit
    });

    res.status(201).json({
      success: true,
      data: entry
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Bulk create data entries
// @route   POST /api/data/bulk
// @access  Private
router.post('/bulk', [authenticateToken, validateBulkDataEntry], async (req, res, next) => {
  try {
    const entries = req.body;
    const userId = req.user.id;

    const sanitizedEntries = entries.map(entry => ({
      date: new Date(entry.date),
      sales: parseFloat(entry.sales),
      profit: parseFloat(entry.profit),
      category: entry.category.trim().toLowerCase(),
      description: entry.description?.trim(),
      tags: entry.tags || [],
      userId,
      metadata: {
        source: 'import',
        importBatch: `batch-${Date.now()}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    }));

    const createdEntries = await DataEntry.insertMany(sanitizedEntries, { 
      ordered: false 
    });

    logApiUsage('data/bulk-create', userId, {
      count: createdEntries.length
    });

    res.status(201).json({
      success: true,
      data: {
        entries: createdEntries,
        count: createdEntries.length
      }
    });
  } catch (error) {
    if (error.name === 'BulkWriteError') {
      // Handle partial success
      const successfulEntries = error.result.insertedIds.length;
      const failedEntries = entries.length - successfulEntries;
      
      logError(error, req);
      
      return res.status(207).json({
        success: true,
        data: {
          message: `Bulk import completed with ${successfulEntries} successful and ${failedEntries} failed entries`,
          successful: successfulEntries,
          failed: failedEntries,
          errors: error.writeErrors
        }
      });
    }
    next(error);
  }
});

// @desc    Update data entry
// @route   PUT /api/data/:id
// @access  Private
router.put('/:id', [authenticateToken, validateId, validateDataEntry], async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, sales, profit, category, description, tags } = req.body;
    const userId = req.user.id;

    const entry = await DataEntry.findOneAndUpdate(
      { _id: id, userId, isActive: true },
      {
        date: new Date(date),
        sales: parseFloat(sales),
        profit: parseFloat(profit),
        category: category.trim().toLowerCase(),
        description: description?.trim(),
        tags: tags || []
      },
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Data entry not found'
      });
    }

    logApiUsage('data/update', userId, {
      entryId: id,
      category,
      sales,
      profit
    });

    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete data entry
// @route   DELETE /api/data/:id
// @access  Private
router.delete('/:id', [authenticateToken, validateId], async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const entry = await DataEntry.findOneAndUpdate(
      { _id: id, userId, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Data entry not found'
      });
    }

    logApiUsage('data/delete', userId, {
      entryId: id
    });

    res.json({
      success: true,
      message: 'Data entry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user statistics
// @route   GET /api/data/stats
// @access  Private
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, category } = req.query;

    const options = { startDate, endDate, category };
    const [stats, categoryBreakdown] = await Promise.all([
      DataEntry.getUserStats(userId, options),
      DataEntry.getCategoryBreakdown(userId, options)
    ]);

    logApiUsage('data/stats', userId, {
      startDate,
      endDate,
      category
    });

    res.json({
      success: true,
      data: {
        summary: stats[0] || {
          totalEntries: 0,
          totalSales: 0,
          totalProfit: 0,
          avgSales: 0,
          avgProfit: 0,
          profitMargin: 0,
          categories: []
        },
        categoryBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Export user data
// @route   GET /api/data/export
// @access  Private
router.get('/export', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { format = 'json', startDate, endDate, category } = req.query;

    const options = { startDate, endDate, category };
    const entries = await DataEntry.getUserEntries(userId, { ...options, limit: 10000 });

    logApiUsage('data/export', userId, {
      format,
      count: entries.length
    });

    if (format === 'csv') {
      // Convert to CSV format
      const csvHeader = 'Date,Sales,Profit,Category,Description,Tags\n';
      const csvData = entries.map(entry => 
        `${entry.date.toISOString().split('T')[0]},${entry.sales},${entry.profit},"${entry.category}","${entry.description || ''}","${entry.tags.join(';')}"`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="data-export.csv"');
      res.send(csvHeader + csvData);
    } else {
      // JSON format
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="data-export.json"');
      res.json({
        success: true,
        data: {
          exportDate: new Date().toISOString(),
          totalEntries: entries.length,
          entries
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
