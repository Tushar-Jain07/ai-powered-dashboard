const { body, param, query, validationResult } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Data entry validation
const validateDataEntry = [
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('sales')
    .isNumeric()
    .withMessage('Sales must be a number')
    .isFloat({ min: 0 })
    .withMessage('Sales must be a positive number'),
  body('profit')
    .isNumeric()
    .withMessage('Profit must be a number'),
  body('category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters'),
  handleValidationErrors
];

// Bulk data entry validation
const validateBulkDataEntry = [
  body()
    .isArray({ min: 1, max: 1000 })
    .withMessage('Must provide an array of 1-1000 entries'),
  body('*.date')
    .isISO8601()
    .withMessage('Each entry must have a valid ISO 8601 date'),
  body('*.sales')
    .isNumeric()
    .withMessage('Each entry must have a numeric sales value')
    .isFloat({ min: 0 })
    .withMessage('Sales must be positive'),
  body('*.profit')
    .isNumeric()
    .withMessage('Each entry must have a numeric profit value'),
  body('*.category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each entry must have a category between 1-50 characters'),
  handleValidationErrors
];

// Chat validation
const validateChat = [
  body('prompt')
    .optional()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Prompt must be between 1 and 2000 characters'),
  body('messages')
    .optional()
    .isArray({ min: 1, max: 50 })
    .withMessage('Messages must be an array of 1-50 items'),
  body('messages.*.role')
    .optional()
    .isIn(['user', 'assistant', 'system'])
    .withMessage('Message role must be user, assistant, or system'),
  body('messages.*.content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message content must be between 1 and 2000 characters'),
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

// Query parameter validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['date', 'sales', 'profit', 'category', '-date', '-sales', '-profit', '-category'])
    .withMessage('Invalid sort field'),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateDataEntry,
  validateBulkDataEntry,
  validateChat,
  validateId,
  validatePagination,
  handleValidationErrors
};
