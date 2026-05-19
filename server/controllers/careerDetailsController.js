const careerDetails = require("../data/careerData");

// ─────────────────────────────────────────────
// @route   GET /api/career-details/:careerName
// @desc    Get full details of a career by name
// @access  Public (no login needed)
// ─────────────────────────────────────────────
const getCareerDetails = (req, res) => {
  // Step 1: Read the career name from the URL parameter
  // e.g. /api/career-details/Software Engineer  →  req.params.careerName = "Software Engineer"
  const rawName = req.params.careerName;

  // Step 2: Normalize to lowercase for case-insensitive lookup
  const key = rawName.toLowerCase();

  // Step 3: Look up the career in our static data
  const career = careerDetails[key];

  // Step 4: If not found, return 404 with helpful message
  if (!career) {
    return res.status(404).json({
      message: `Career "${rawName}" not found. Available: Software Engineer, Data Scientist, UI/UX Designer, Cyber Security Analyst, DevOps Engineer, Mobile App Developer`,
    });
  }

  // Step 5: Return the career details
  res.status(200).json({
    message: "Career details fetched successfully",
    data: career,
  });
};

// ─────────────────────────────────────────────
// @route   GET /api/career-details
// @desc    Get a list of all available career names
// @access  Public
// ─────────────────────────────────────────────
const getAllCareerNames = (req, res) => {
  // Return just the titles of all careers in our data file
  const allCareers = Object.values(careerDetails).map((c) => c.title);

  res.status(200).json({
    message: "Available careers fetched successfully",
    count: allCareers.length,
    careers: allCareers,
  });
};

module.exports = { getCareerDetails, getAllCareerNames };
