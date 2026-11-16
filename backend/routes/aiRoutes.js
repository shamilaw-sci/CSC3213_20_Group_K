const express = require("express");

const router = express.Router();

const { getAIRecommendation } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

// GET /api/ai/recommendation
router.get("/recommendation", protect, requireRole("student"), getAIRecommendation);

module.exports = router;
