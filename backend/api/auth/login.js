module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password } = req.body;
  // Demo account for portfolio visitors
  if (email === 'demo@ai-dashmind.com' && password === 'demo123') {
    return res.json({
      token: 'demo-jwt-token-portfolio',
      _id: 'demo-user-1',
      name: 'Demo User',
      email: 'demo@ai-dashmind.com',
      role: 'admin',
      isDemo: true
    });
  }
  // Regular demo login (any credentials work)
  res.json({
    token: 'mock-jwt-token',
    _id: '1',
    name: 'Demo User',
    email: email || 'user@example.com',
    role: 'admin',
    isDemo: false
  });
}; 