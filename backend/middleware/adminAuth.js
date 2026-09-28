/**
 * adminAuth.js — JWT middleware for admin-protected routes
 */
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'futurepath-admin-secret-2025';

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  // Allow demo token without verification
  if (token === 'demo-token-12345') {
    req.admin = { id: 'demo', name: 'Super Admin', email: 'admin@futurepath.ai', role: 'Super Admin' };
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = adminAuth;
