const express = require("express");

const router = express.Router();

const { getAIRecommendation } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

// GET /api/ai/recommendation
router.get("/recommendation", protect, getAIRecommendation);

module.exports = router;