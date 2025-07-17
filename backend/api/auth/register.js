module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.json({
    token: 'mock-jwt-token',
    _id: '1',
    name: req.body.name,
    email: req.body.email,
    role: 'user'
  });
}; 