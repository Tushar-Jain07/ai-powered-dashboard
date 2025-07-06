require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Create Express app
const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
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

// Socket.io events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on('subscribe-to-dashboard', (dashboardId) => {
    console.log(`User ${socket.id} subscribed to dashboard ${dashboardId}`);
    socket.join(`dashboard-${dashboardId}`);
  });

  socket.on('unsubscribe-from-dashboard', (dashboardId) => {
    console.log(`User ${socket.id} unsubscribed from dashboard ${dashboardId}`);
    socket.leave(`dashboard-${dashboardId}`);
  });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 