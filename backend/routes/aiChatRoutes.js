const express = require("express");

const router = express.Router();
const { chatWithAI } = require("../controllers/aiChatController");
const protect = require("../middleware/authMiddleware");

// POST /api/ai-chat
router.post("/", protect, chatWithAI);

module.exports = router;
