const jwt = require('jsonwebtoken');

function signJwt(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
}

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password } = req.body;
  // Demo account for portfolio visitors
  if (email === 'demo@ai-dashmind.com' && password === 'demo123') {
    const token = signJwt({ id: 'demo-user-1', email, role: 'admin', isDemo: true });
    return res.json({ token, _id: 'demo-user-1', name: 'Demo User', email, role: 'admin', isDemo: true });
  }
  // Regular demo login (any credentials work)
  const token = signJwt({ id: '1', email: email || 'user@example.com', role: 'admin', isDemo: false });
  res.json({ token, _id: '1', name: 'Demo User', email: email || 'user@example.com', role: 'admin', isDemo: false });
}; 