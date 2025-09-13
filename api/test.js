// Vercel serverless function for test endpoint
export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
}