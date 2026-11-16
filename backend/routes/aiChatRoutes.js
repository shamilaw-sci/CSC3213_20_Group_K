const express = require("express");

const router = express.Router();
const { chatWithAI } = require("../controllers/aiChatController");
const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

// POST /api/ai-chat
router.post("/", protect, requireRole("student"), chatWithAI);

module.exports = router;
