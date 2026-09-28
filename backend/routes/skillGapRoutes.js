const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getSkillGap } = require("../controllers/skillGapController");

const router = express.Router();

// GET /api/skill-gap
router.get("/", protect, getSkillGap);

module.exports = router;
