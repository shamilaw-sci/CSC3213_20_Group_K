const express = require("express");
const router = express.Router();

// Import the controller function
const { getLearningPath } = require("../controllers/learningPathController");


// ─────────────────────────────────────────────
// Learning Path Routes
// Base path: /api/learning-path  (set in server.js)
// ─────────────────────────────────────────────

// GET /api/learning-path/:careerName
// Example: GET /api/learning-path/Software Engineer
// Returns: career, skills[], courses[], projects[]
router.get("/:careerName", getLearningPath);


module.exports = router;
