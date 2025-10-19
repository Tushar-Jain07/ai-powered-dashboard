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
  
  // Demo auth endpoints
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Demo account for testing
    if (email === 'demo@ai-dashmind.com' && password === 'demo123') {
      res.json({
        success: true,
        data: {
          token: 'demo-token-' + Date.now(),
          user: {
            _id: 'demo-user-1',
            name: 'Demo User',
            email: email,
            role: 'admin',
            isDemo: true
          }
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials. Use demo@ai-dashmind.com / demo123'
      });
    }
  });
  
  app.post('/api/auth/register', (req, res) => {
    res.json({
      success: true,
      message: 'Registration is disabled in demo mode. Use demo@ai-dashmind.com / demo123 to login.'
    });
  });
  
  app.get('/api/auth/validate', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer demo-token')) {
      res.json({
        success: true,
        user: {
          _id: 'demo-user-1',
          name: 'Demo User',
          email: 'demo@ai-dashmind.com',
          role: 'admin',
          isDemo: true
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
  });
  
  module.exports = app;
}
