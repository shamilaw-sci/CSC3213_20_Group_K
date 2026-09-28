/**
 * skillRoutes.js — Skill CRUD
 */
const router    = require('express').Router();
const Skill     = require('../../models/Skill');
const adminAuth = require('../../middleware/adminAuth');

router.get('/', adminAuth, async (req, res) => {
  try {
    const { search, category } = req.query;
    let q = {};
    if (search)   q.name     = { $regex: search, $options: 'i' };
    if (category) q.category = category;
    res.json(await Skill.find(q).sort({ name: 1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', adminAuth, async (req, res) => {
  try { res.status(201).json(await Skill.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const s = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!s) return res.status(404).json({ message: 'Not found' });
    res.json(s);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try { await Skill.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
