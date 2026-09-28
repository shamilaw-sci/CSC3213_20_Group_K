/**
 * authRoutes.js — Admin auth endpoints
 * POST /api/admin/auth/login
 * GET  /api/admin/auth/profile
 */
const router  = require('express').Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const Admin   = require('../../models/Admin');
const adminAuth = require('../../middleware/adminAuth');

const JWT_SECRET = process.env.JWT_SECRET || 'futurepath-admin-secret-2025';
const EXPIRES_IN = '7d';

// POST /api/admin/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(401).json({ message: 'Invalid email or password' });
    if (!admin.isActive) return res.status(403).json({ message: 'Account is deactivated' });

    const match = await admin.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, JWT_SECRET, { expiresIn: EXPIRES_IN });

    res.json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/auth/profile  (protected)
router.get('/profile', adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
