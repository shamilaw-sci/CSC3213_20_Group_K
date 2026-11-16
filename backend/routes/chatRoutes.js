const express = require("express");

const router = express.Router();
const { chatWithCareerAI } = require("../controllers/chatController");
const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

// POST /api/chat
router.post("/", protect, requireRole("student"), chatWithCareerAI);

module.exports = router;
