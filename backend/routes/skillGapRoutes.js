const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const { getSkillGap } = require("../controllers/skillGapController");

const router = express.Router();

// GET /api/skill-gap
router.get("/", protect, requireRole("student"), getSkillGap);

module.exports = router;
