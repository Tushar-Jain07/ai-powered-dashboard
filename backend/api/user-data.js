const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Connect to MongoDB (reuse connection if already open)
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_dashboard';
if (mongoose.connection.readyState === 0) {
  mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
}

// DataEntry model
const dataEntrySchema = new mongoose.Schema({
  date: { type: String, required: true },
  sales: { type: Number, required: true },
  profit: { type: Number, required: true },
  category: { type: String, required: true },
  userId: { type: String, required: true },
}, { timestamps: true });
const DataEntry = mongoose.models.DataEntry || mongoose.model('DataEntry', dataEntrySchema);

// JWT auth helper
function getUserFromToken(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  // GET /api/user-data
  if (req.method === 'GET') {
    const entries = await DataEntry.find({ userId: user.id });
    return res.status(200).json(entries);
  }

  // POST /api/user-data
  if (req.method === 'POST') {
    const { date, sales, profit, category } = req.body;
    if (!date || sales == null || profit == null || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const entry = new DataEntry({ date, sales, profit, category, userId: user.id });
    await entry.save();
    return res.status(201).json(entry);
  }

  // PUT /api/user-data?id=xxx
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { date, sales, profit, category } = req.body;
    const entry = await DataEntry.findOneAndUpdate(
      { _id: id, userId: user.id },
      { date, sales, profit, category },
      { new: true }
    );
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    return res.status(200).json(entry);
  }

  // DELETE /api/user-data?id=xxx
  if (req.method === 'DELETE') {
    const { id } = req.query;
    const result = await DataEntry.deleteOne({ _id: id, userId: user.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Entry not found' });
    return res.status(200).json({ success: true });
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}; 