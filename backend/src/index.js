require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Initialize OpenAI only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_dashboard';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Create Express app
const app = express();

// Middleware
// Dynamically determine allowed origins
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      '*', // Allow all origins in production for Vercel deployment
      'https://ai-dashmind-4ztkmvl3m-tushar-jain07s-projects.vercel.app',
      /\.vercel\.app$/
    ]
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3003',
      'http://localhost:3005'
    ];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // In production, allow all origins for Vercel deployment
    if (process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.warn(`Origin ${origin} not allowed by CORS`);
    return callback(null, true); // Still allow it for now
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Add timestamp middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running', 
    environment: process.env.NODE_ENV,
    openai_configured: !!openai
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// Helpers
function signJwt(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
}

function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (allowed.length === 0 || allowed.includes(req.user.role)) return next();
    return res.status(403).json({ error: 'Forbidden' });
  };
}

// API routes
app.post('/api/auth/login', (req, res) => {
  // Mock authentication endpoint - enhanced for portfolio
  console.log('Login request received');
  console.log('Request body:', req.body);
  
  const { email, password } = req.body;
  
  // Demo account for portfolio visitors
  if (email === 'demo@ai-dashmind.com' && password === 'demo123') {
    const token = signJwt({ id: 'demo-user-1', email, role: 'admin', isDemo: true });
    return res.json({ token, _id: 'demo-user-1', name: 'Demo User', email, role: 'admin', isDemo: true });
  }
  
  // Regular demo login (any credentials work)
  const token = signJwt({ id: '1', email: email || 'user@example.com', role: 'admin', isDemo: false });
  res.json({ token, _id: '1', name: 'Demo User', email: email || 'user@example.com', role: 'admin', isDemo: false });
});

app.post('/api/auth/register', (req, res) => {
  // Mock registration endpoint
  res.json({
    token: 'mock-jwt-token',
    _id: '1',
    name: req.body.name,
    email: req.body.email,
    role: 'user'
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const { id, email, role, isDemo } = req.user;
  res.json({ _id: id, name: isDemo ? 'Demo User' : 'Demo User', email: email || 'user@example.com', role, isDemo: !!isDemo });
});

// Additional API endpoints for dashboard data
app.get('/api/dashboard/stats', authenticateToken, requireRole(['admin', 'user']), (req, res) => {
  res.json({
    totalUsers: 1250,
    activeUsers: 847,
    totalRevenue: 45678,
    growthRate: 12.5
  });
});

app.get('/api/dashboard/analytics', authenticateToken, requireRole(['admin', 'user']), (req, res) => {
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

// AI chat endpoint (non-streaming)
app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY environment variable.' 
      });
    }

    const { prompt, messages } = req.body;

    // Basic guard
    if (!prompt && (!messages || !Array.isArray(messages))) {
      return res.status(400).json({ error: 'Prompt or messages array is required' });
    }

    const chatMessages = messages && Array.isArray(messages) ? messages : [
      { role: 'user', content: prompt }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 512,
    });

    const assistantMessage = completion.choices?.[0]?.message?.content || '';
    res.json({ message: assistantMessage });
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate response from OpenAI' });
  }
});

// AI chat streaming endpoint (Server-Sent Events)
app.get('/api/chat/stream', authenticateToken, async (req, res) => {
  try {
    if (!openai) {
      res.writeHead(500, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({ error: 'OpenAI API key not configured' })}\n\n`);
      return res.end();
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const { prompt, messages } = req.query;
    const chatMessages = messages ? JSON.parse(String(messages)) : [{ role: 'user', content: String(prompt || '') }];

    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 512,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        res.write(`data: ${JSON.stringify({ token: delta })}\n\n`);
      }
    }
    res.write('event: end\n');
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('OpenAI stream error:', error.response?.data || error.message);
    res.write(`event: error\n`);
    res.write(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`);
    res.end();
  }
});

// DataEntry Mongoose model
const dataEntrySchema = new mongoose.Schema({
  date: { type: String, required: true },
  sales: { type: Number, required: true },
  profit: { type: Number, required: true },
  category: { type: String, required: true },
  userId: { type: String, required: true },
}, { timestamps: true });
const DataEntry = mongoose.model('DataEntry', dataEntrySchema);

// JWT auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET || 'dev_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// CRUD endpoints for user data
app.get('/api/user-data', authenticateToken, async (req, res) => {
  const entries = await DataEntry.find({ userId: req.user.id });
  res.json(entries);
});

app.post('/api/user-data', authenticateToken, async (req, res) => {
  const { date, sales, profit, category } = req.body;
  if (!date || sales == null || profit == null || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const entry = new DataEntry({ date, sales, profit, category, userId: req.user.id });
  await entry.save();
  res.status(201).json(entry);
});

app.put('/api/user-data/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { date, sales, profit, category } = req.body;
  const entry = await DataEntry.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    { date, sales, profit, category },
    { new: true }
  );
  if (!entry) return res.status(404).json({ error: 'Entry not found' });
  res.json(entry);
});

app.delete('/api/user-data/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const result = await DataEntry.deleteOne({ _id: id, userId: req.user.id });
  if (result.deletedCount === 0) return res.status(404).json({ error: 'Entry not found' });
  res.json({ success: true });
});

// Catch-all route for API
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5003;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless function
module.exports = app; 