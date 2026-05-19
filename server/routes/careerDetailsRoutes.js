const express = require("express");
const router = express.Router();

// Import controller functions
const {
  getCareerDetails,
  getAllCareerNames,
} = require("../controllers/careerDetailsController");


// ─────────────────────────────────────────────
// Career Details Routes
// Base path: /api/career-details  (set in server.js)
// NOTE: This is SEPARATE from /api/careers (which uses MongoDB CRUD).
//       This route serves STATIC career info by name.
// ─────────────────────────────────────────────

// GET /api/career-details
// Returns a list of all available career names
router.get("/", getAllCareerNames);

// GET /api/career-details/:careerName
// Example: GET /api/career-details/Software Engineer
// Returns: title, description, salaryRange, requiredSkills[], futureScope
router.get("/:careerName", getCareerDetails);


module.exports = router;
