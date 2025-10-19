// Vercel serverless function entry point
// Simplified version for debugging
try {
  const app = require('../backend/src/index');
  module.exports = app;
} catch (error) {
  console.error('Failed to load backend:', error);
  
  // Fallback simple API
  const express = require('express');
  const cors = require('cors');
  
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  
  // Simple health check
  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      message: 'Fallback API is working',
      timestamp: new Date().toISOString(),
      error: 'Backend failed to load'
    });
  });
  
  // Simple test endpoint
  app.get('/api/test', (req, res) => {
    res.json({
      success: true,
      message: 'Fallback test endpoint working',
      timestamp: new Date().toISOString()
    });
  });
  
  module.exports = app;
}
