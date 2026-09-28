/**
 * adminStudentRoutes.js — Admin student CRUD
 * GET    /api/admin/students
 * GET    /api/admin/students/:id
 * POST   /api/admin/students
 * PUT    /api/admin/students/:id
 * DELETE /api/admin/students/:id
 * PATCH  /api/admin/students/:id/toggle-status
 */
const router    = require('express').Router();
const adminAuth = require('../../middleware/adminAuth');

// Try to import Student model — fall back gracefully
let Student;
try { Student = require('../../models/student'); } catch {
  try { Student = require('../../models/Student'); } catch { Student = null; }
}

const notFound = (res) => res.status(404).json({ message: 'Student not found' });

// GET all
router.get('/', adminAuth, async (req, res) => {
  try {
    if (!Student) return res.json([]);
    const { search, faculty, status, page = 1, limit = 50 } = req.query;
    let query = {};
    if (search) query.$or = [{ fullName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    if (faculty) query.faculty = faculty;
    if (status)  query.status  = status;
    const data = await Student.find(query).limit(Number(limit)).skip((Number(page)-1)*Number(limit)).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET by ID
router.get('/:id', adminAuth, async (req, res) => {
  try {
    if (!Student) return notFound(res);
    const s = await Student.findById(req.params.id);
    if (!s) return notFound(res);
    res.json(s);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create
router.post('/', adminAuth, async (req, res) => {
  try {
    if (!Student) return res.status(503).json({ message: 'Student model unavailable' });
    const s = new Student(req.body);
    await s.save();
    res.status(201).json(s);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT update
router.put('/:id', adminAuth, async (req, res) => {
  try {
    if (!Student) return notFound(res);
    const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!s) return notFound(res);
    res.json(s);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    if (!Student) return notFound(res);
    const s = await Student.findByIdAndDelete(req.params.id);
    if (!s) return notFound(res);
    res.json({ message: 'Student deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH toggle status
router.patch('/:id/toggle-status', adminAuth, async (req, res) => {
  try {
    if (!Student) return notFound(res);
    const s = await Student.findById(req.params.id);
    if (!s) return notFound(res);
    s.status = s.status === 'Active' ? 'Inactive' : 'Active';
    await s.save();
    res.json(s);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
