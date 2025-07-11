require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Initialize OpenAI only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

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

// API routes
app.post('/api/auth/login', (req, res) => {
  // Mock authentication endpoint - simplified
  console.log('Login request received');
  console.log('Request body:', req.body);
  
  // Always return success regardless of credentials
  res.json({
    token: 'mock-jwt-token',
    _id: '1',
    name: 'Demo User',
    email: req.body?.email || 'user@example.com',
    role: 'admin'
  });
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

app.get('/api/auth/me', (req, res) => {
  // Mock user profile endpoint
  res.json({
    _id: '1',
    name: 'Demo User',
    email: 'user@example.com',
    role: 'admin'
  });
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

// AI chat endpoint
app.post('/api/chat', async (req, res) => {
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