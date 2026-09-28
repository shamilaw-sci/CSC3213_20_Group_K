/**
 * resourceRoutes.js — Learning Resource CRUD
 */
const router     = require('express').Router();
const Resource   = require('../../models/LearningResource');
const adminAuth  = require('../../middleware/adminAuth');

router.get('/', adminAuth, async (req, res) => {
  try {
    const { search, difficultyLevel } = req.query;
    let q = {};
    if (search)          q.$or = [{ title: { $regex: search, $options: 'i' } }, { provider: { $regex: search, $options: 'i' } }];
    if (difficultyLevel) q.difficultyLevel = difficultyLevel;
    res.json(await Resource.find(q).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', adminAuth, async (req, res) => {
  try { res.status(201).json(await Resource.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const r = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json(r);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try { await Resource.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
