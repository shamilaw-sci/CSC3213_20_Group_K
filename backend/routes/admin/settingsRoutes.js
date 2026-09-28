/**
 * settingsRoutes.js — System settings
 */
const router    = require('express').Router();
const adminAuth = require('../../middleware/adminAuth');

let currentSettings = {
  matchingThreshold:    65,
  allowRegistration:    true,
  emailNotifications:   true,
  maintenanceMode:      false,
  maxRecommendations:   5,
  profileRequiredFields: true,
  autoApproveStudents:  false,
  adminEmail:           'admin@futurepath.ai',
  systemName:           'FuturePath AI',
  language:             'English',
};

router.get('/', adminAuth, (req, res) => res.json(currentSettings));

router.put('/', adminAuth, (req, res) => {
  currentSettings = { ...currentSettings, ...req.body };
  res.json({ message: 'Settings updated', settings: currentSettings });
});

module.exports = router;
