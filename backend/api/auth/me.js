module.exports = (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const authHeader = req.headers.authorization;
  // Check if it's the demo token
  if (authHeader && authHeader.includes('demo-jwt-token-portfolio')) {
    return res.json({
      _id: 'demo-user-1',
      name: 'Demo User',
      email: 'demo@ai-dashmind.com',
      role: 'admin',
      isDemo: true
    });
  }
  res.json({
    _id: '1',
    name: 'Demo User',
    email: 'user@example.com',
    role: 'admin',
    isDemo: false
  });
}; 