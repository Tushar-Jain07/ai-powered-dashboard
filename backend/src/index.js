require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API routes
app.use('/api/auth', (req, res) => {
  // Mock authentication endpoint
  if (req.method === 'POST' && req.path === '/login') {
    res.json({
      token: 'mock-jwt-token',
      _id: '1',
      name: 'Demo User',
      email: 'user@example.com',
      role: 'admin'
    });
  } else if (req.method === 'POST' && req.path === '/register') {
    res.json({
      token: 'mock-jwt-token',
      _id: '1',
      name: req.body.name,
      email: req.body.email,
      role: 'user'
    });
  } else if (req.method === 'GET' && req.path === '/me') {
    res.json({
      _id: '1',
      name: 'Demo User',
      email: 'user@example.com',
      role: 'admin'
    });
  } else {
    res.status(404).json({ message: 'Endpoint not found' });
  }
});

// Additional API endpoints for dashboard data
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    totalUsers: 1250,
    activeUsers: 847,
    totalRevenue: 45678,
    growthRate: 12.5
  });
});

app.get('/api/dashboard/analytics', (req, res) => {
  res.json({
    chartData: [
      { month: 'Jan', value: 100 },
      { month: 'Feb', value: 150 },
      { month: 'Mar', value: 200 },
      { month: 'Apr', value: 180 },
      { month: 'May', value: 250 },
      { month: 'Jun', value: 300 }
    ]
  });
});

// For all environments
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for serverless environments
module.exports = app; 