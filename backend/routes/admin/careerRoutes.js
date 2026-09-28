/**
 * careerRoutes.js — Career CRUD
 */
const router    = require('express').Router();
const Career    = require('../../models/Career');
const adminAuth = require('../../middleware/adminAuth');

router.get('/', adminAuth, async (req, res) => {
  try {
    const { search, industry, demandLevel } = req.query;
    let q = {};
    if (search)      q.name     = { $regex: search, $options: 'i' };
    if (industry)    q.industry = industry;
    if (demandLevel) q.demandLevel = demandLevel;
    res.json(await Career.find(q).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', adminAuth, async (req, res) => {
  try {
    const c = await Career.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json(c);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const c = await Career.create(req.body);
    res.status(201).json(c);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const c = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json(c);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Career.findByIdAndDelete(req.params.id);
    res.json({ message: 'Career deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
