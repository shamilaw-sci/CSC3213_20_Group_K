/**
 * feedbackRoutes.js — Feedback management
 */
const router    = require('express').Router();
const Feedback  = require('../../models/Feedback');
const adminAuth = require('../../middleware/adminAuth');

router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, search } = req.query;
    let q = {};
    if (status) q.status = status;
    if (search) q.$or = [{ studentName: { $regex: search, $options: 'i' } }, { comment: { $regex: search, $options: 'i' } }];
    res.json(await Feedback.find(q).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try { await Feedback.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id/review', adminAuth, async (req, res) => {
  try {
    const f = await Feedback.findByIdAndUpdate(req.params.id, { status: 'Reviewed' }, { new: true });
    if (!f) return res.status(404).json({ message: 'Not found' });
    res.json(f);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id/reply', adminAuth, async (req, res) => {
  try {
    const { reply } = req.body;
    const f = await Feedback.findByIdAndUpdate(req.params.id, { reply, status: 'Reviewed' }, { new: true });
    if (!f) return res.status(404).json({ message: 'Not found' });
    res.json(f);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
