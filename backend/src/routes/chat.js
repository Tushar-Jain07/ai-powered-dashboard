const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validateChat, handleValidationErrors } = require('../middleware/validation');
const { logApiUsage, logError } = require('../utils/logger');

const router = express.Router();

// Initialize OpenAI
let openai = null;
if (process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// @desc    Chat with AI (non-streaming)
// @route   POST /api/chat
// @access  Private
router.post('/', [authenticateToken, validateChat], async (req, res, next) => {
  try {
    if (!openai) {
      return res.status(503).json({
        success: false,
        error: 'AI service is not available. Please configure OpenAI API key.'
      });
    }

    const { prompt, messages } = req.body;
    const userId = req.user.id;

    // Prepare chat messages
    const chatMessages = messages && Array.isArray(messages) ? messages : [
      { role: 'user', content: prompt }
    ];

    // Add system message for context
    const systemMessage = {
      role: 'system',
      content: 'You are an AI assistant for an analytics dashboard. Help users understand their data, provide insights, and answer questions about analytics, charts, and business intelligence. Be concise and helpful.'
    };

    const allMessages = [systemMessage, ...chatMessages];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 512,
      user: userId // For tracking and abuse prevention
    });

    const assistantMessage = completion.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Log API usage
    logApiUsage('chat/completion', userId, {
      model: 'gpt-3.5-turbo',
      tokens: completion.usage?.total_tokens || 0,
      promptLength: prompt?.length || 0
    });

    res.json({
      success: true,
      data: {
        message: assistantMessage,
        usage: completion.usage,
        model: 'gpt-3.5-turbo'
      }
    });
  } catch (error) {
    logError(error, req);
    
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({
        success: false,
        error: 'AI service quota exceeded. Please try again later.'
      });
    }
    
    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        success: false,
        error: 'AI service rate limit exceeded. Please slow down your requests.'
      });
    }

    next(error);
  }
});

// @desc    Chat with AI (streaming)
// @route   GET /api/chat/stream
// @access  Private
router.get('/stream', [authenticateToken, validateChat], async (req, res, next) => {
  try {
    if (!openai) {
      res.writeHead(503, { 
        'Content-Type': 'text/event-stream', 
        'Cache-Control': 'no-cache', 
        'Connection': 'keep-alive' 
      });
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({ 
        success: false,
        error: 'AI service is not available. Please configure OpenAI API key.' 
      })}\n\n`);
      return res.end();
    }

    const { prompt, messages } = req.query;
    const userId = req.user.id;

    // Set up Server-Sent Events headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Prepare chat messages
    const chatMessages = messages ? JSON.parse(String(messages)) : [{ role: 'user', content: String(prompt || '') }];
    
    // Add system message
    const systemMessage = {
      role: 'system',
      content: 'You are an AI assistant for an analytics dashboard. Help users understand their data, provide insights, and answer questions about analytics, charts, and business intelligence. Be concise and helpful.'
    };

    const allMessages = [systemMessage, ...chatMessages];

    // Create streaming completion
    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 512,
      stream: true,
      user: userId
    });

    let totalTokens = 0;

    // Stream the response
    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        res.write(`data: ${JSON.stringify({ 
          success: true,
          token: delta 
        })}\n\n`);
      }
      
      // Track usage
      if (chunk.usage) {
        totalTokens = chunk.usage.total_tokens;
      }
    }

    // Send completion event
    res.write(`event: complete\n`);
    res.write(`data: ${JSON.stringify({ 
      success: true,
      usage: { total_tokens: totalTokens },
      model: 'gpt-3.5-turbo'
    })}\n\n`);
    
    res.end();

    // Log API usage
    logApiUsage('chat/stream', userId, {
      model: 'gpt-3.5-turbo',
      tokens: totalTokens,
      promptLength: prompt?.length || 0
    });

  } catch (error) {
    logError(error, req);
    
    res.write(`event: error\n`);
    res.write(`data: ${JSON.stringify({ 
      success: false,
      error: 'Streaming failed. Please try again.' 
    })}\n\n`);
    res.end();
  }
});

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
router.get('/history', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    // In a real application, you would store chat history in a database
    // For now, we'll return an empty array
    const chatHistory = [];

    logApiUsage('chat/history', userId, {
      limit,
      offset
    });

    res.json({
      success: true,
      data: {
        history: chatHistory,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: chatHistory.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Clear chat history
// @route   DELETE /api/chat/history
// @access  Private
router.delete('/history', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // In a real application, you would delete chat history from database
    // For now, we'll just log the action

    logApiUsage('chat/clear-history', userId);

    res.json({
      success: true,
      message: 'Chat history cleared successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get AI service status
// @route   GET /api/chat/status
// @access  Private
router.get('/status', authenticateToken, async (req, res, next) => {
  try {
    const isAvailable = !!openai;
    
    res.json({
      success: true,
      data: {
        available: isAvailable,
        model: 'gpt-3.5-turbo',
        features: {
          streaming: isAvailable,
          nonStreaming: isAvailable,
          history: false // Not implemented yet
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
