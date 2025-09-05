const mongoose = require('mongoose');

const dataEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required'],
    index: true
  },
  sales: {
    type: Number,
    required: [true, 'Sales amount is required'],
    min: [0, 'Sales cannot be negative'],
    validate: {
      validator: function(v) {
        return Number.isFinite(v);
      },
      message: 'Sales must be a valid number'
    }
  },
  profit: {
    type: Number,
    required: [true, 'Profit amount is required'],
    validate: {
      validator: function(v) {
        return Number.isFinite(v);
      },
      message: 'Profit must be a valid number'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    minlength: [1, 'Category cannot be empty'],
    maxlength: [50, 'Category cannot exceed 50 characters'],
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  metadata: {
    source: {
      type: String,
      enum: ['manual', 'import', 'api'],
      default: 'manual'
    },
    originalData: mongoose.Schema.Types.Mixed,
    importBatch: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for efficient querying
dataEntrySchema.index({ userId: 1, date: -1 });
dataEntrySchema.index({ userId: 1, category: 1 });
dataEntrySchema.index({ userId: 1, date: -1, category: 1 });
dataEntrySchema.index({ userId: 1, isActive: 1 });

// Virtual for profit margin
dataEntrySchema.virtual('profitMargin').get(function() {
  if (this.sales === 0) return 0;
  return ((this.profit / this.sales) * 100).toFixed(2);
});

// Virtual for formatted date
dataEntrySchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Pre-save middleware to validate data
dataEntrySchema.pre('save', function(next) {
  // Ensure profit margin is reasonable (not more than 100%)
  if (this.sales > 0 && this.profit > this.sales) {
    return next(new Error('Profit cannot exceed sales amount'));
  }
  
  // Normalize category
  if (this.category) {
    this.category = this.category.trim().toLowerCase();
  }
  
  // Normalize tags
  if (this.tags && Array.isArray(this.tags)) {
    this.tags = this.tags
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0)
      .slice(0, 10); // Limit to 10 tags
  }
  
  next();
});

// Static method to get user's data entries with pagination
dataEntrySchema.statics.getUserEntries = function(userId, options = {}) {
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
  } = options;

  const query = { userId, isActive: true };

  // Apply filters
  if (category) {
    query.category = new RegExp(category, 'i');
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  if (minSales !== undefined || maxSales !== undefined) {
    query.sales = {};
    if (minSales !== undefined) query.sales.$gte = minSales;
    if (maxSales !== undefined) query.sales.$lte = maxSales;
  }

  if (minProfit !== undefined || maxProfit !== undefined) {
    query.profit = {};
    if (minProfit !== undefined) query.profit.$gte = minProfit;
    if (maxProfit !== undefined) query.profit.$lte = maxProfit;
  }

  const skip = (page - 1) * limit;

  return this.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('userId', 'name email');
};

// Static method to get aggregated statistics
dataEntrySchema.statics.getUserStats = function(userId, options = {}) {
  const { startDate, endDate, category } = options;

  const matchQuery = { userId, isActive: true };

  if (startDate || endDate) {
    matchQuery.date = {};
    if (startDate) matchQuery.date.$gte = new Date(startDate);
    if (endDate) matchQuery.date.$lte = new Date(endDate);
  }

  if (category) {
    matchQuery.category = new RegExp(category, 'i');
  }

  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalEntries: { $sum: 1 },
        totalSales: { $sum: '$sales' },
        totalProfit: { $sum: '$profit' },
        avgSales: { $avg: '$sales' },
        avgProfit: { $avg: '$profit' },
        minSales: { $min: '$sales' },
        maxSales: { $max: '$sales' },
        minProfit: { $min: '$profit' },
        maxProfit: { $max: '$profit' },
        categories: { $addToSet: '$category' }
      }
    },
    {
      $addFields: {
        profitMargin: {
          $cond: {
            if: { $gt: ['$totalSales', 0] },
            then: { $multiply: [{ $divide: ['$totalProfit', '$totalSales'] }, 100] },
            else: 0
          }
        }
      }
    }
  ]);
};

// Static method to get category breakdown
dataEntrySchema.statics.getCategoryBreakdown = function(userId, options = {}) {
  const { startDate, endDate } = options;

  const matchQuery = { userId, isActive: true };

  if (startDate || endDate) {
    matchQuery.date = {};
    if (startDate) matchQuery.date.$gte = new Date(startDate);
    if (endDate) matchQuery.date.$lte = new Date(endDate);
  }

  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalSales: { $sum: '$sales' },
        totalProfit: { $sum: '$profit' },
        avgSales: { $avg: '$sales' },
        avgProfit: { $avg: '$profit' }
      }
    },
    {
      $addFields: {
        profitMargin: {
          $cond: {
            if: { $gt: ['$totalSales', 0] },
            then: { $multiply: [{ $divide: ['$totalProfit', '$totalSales'] }, 100] },
            else: 0
          }
        }
      }
    },
    { $sort: { totalSales: -1 } }
  ]);
};

module.exports = mongoose.model('DataEntry', dataEntrySchema);
