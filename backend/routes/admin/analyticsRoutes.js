/**
 * analyticsRoutes.js — Analytics data
 */
const router    = require('express').Router();
const adminAuth = require('../../middleware/adminAuth');

// GET /api/admin/analytics — return aggregated metrics
router.get('/', adminAuth, async (req, res) => {
  try {
    // In production these would aggregate from the DB
    res.json({
      totalStudents:    1284,
      totalCareers:     48,
      totalSkills:      127,
      totalResources:   342,
      totalRecommendations: 9871,
      activeUsers:      618,
      newToday:         24,
      pendingFeedback:  37,
      careerDistribution: [
        { name: 'Software Engineer', value: 28 },
        { name: 'Data Scientist',    value: 22 },
        { name: 'Cybersecurity',     value: 14 },
        { name: 'Cloud Architect',   value: 12 },
        { name: 'UX Designer',       value: 10 },
        { name: 'Business Analyst',  value: 8  },
        { name: 'Other',             value: 6  },
      ],
      monthlyRecommendations: [
        { month: 'Jan', recommendations: 620 }, { month: 'Feb', recommendations: 840 },
        { month: 'Mar', recommendations: 720 }, { month: 'Apr', recommendations: 1100 },
        { month: 'May', recommendations: 980 }, { month: 'Jun', recommendations: 1340 },
        { month: 'Jul', recommendations: 1520 }, { month: 'Aug', recommendations: 1280 },
        { month: 'Sep', recommendations: 900 }, { month: 'Oct', recommendations: 1050 },
        { month: 'Nov', recommendations: 870 }, { month: 'Dec', recommendations: 1400 },
      ],
      registrationTrend: [
        { month: 'Jan', students: 80  }, { month: 'Feb', students: 105 },
        { month: 'Mar', students: 98  }, { month: 'Apr', students: 140 },
        { month: 'May', students: 127 }, { month: 'Jun', students: 165 },
        { month: 'Jul', students: 190 }, { month: 'Aug', students: 175 },
        { month: 'Sep', students: 210 }, { month: 'Oct', students: 198 },
        { month: 'Nov', students: 230 }, { month: 'Dec', students: 255 },
      ],
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
