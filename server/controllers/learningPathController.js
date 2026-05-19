const learningPaths = require("../data/learningPathData");

// ─────────────────────────────────────────────
// @route   GET /api/learning-path/:careerName
// @desc    Get the learning path for a specific career
// @access  Public (no login needed)
// ─────────────────────────────────────────────
const getLearningPath = (req, res) => {
  // Step 1: Read the career name from the URL
  // e.g. /api/learning-path/Software Engineer  →  req.params.careerName = "Software Engineer"
  const rawName = req.params.careerName;

  // Step 2: Convert to lowercase so lookup works regardless of case
  // "Software Engineer" → "software engineer"
  const key = rawName.toLowerCase();

  // Step 3: Look up that career in our data file
  const path = learningPaths[key];

  // Step 4: If not found, return a 404 error
  if (!path) {
    return res.status(404).json({
      message: `No learning path found for "${rawName}". Try: Software Engineer, Data Scientist, UI/UX Designer, Cyber Security Analyst, DevOps Engineer`,
    });
  }

  // Step 5: Return the learning path data
  res.status(200).json({
    message: "Learning path fetched successfully",
    data: path,
  });
};

module.exports = { getLearningPath };
