const express = require("express");

const router = express.Router();
const { chatWithCareerAI } = require("../controllers/chatController");
const protect = require("../middleware/authMiddleware");

// POST /api/chat
router.post("/", protect, chatWithCareerAI);

module.exports = router;
