// This file serves as the entry point for Vercel serverless functions
const app = require('../src/index.js');

// Export the Express API as a serverless function
module.exports = app; 