const express = require("express");

const {
  createProfile,
  getProfile,
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

router.post("/", protect, requireRole("student"), createProfile);
router.get("/", protect, requireRole("student"), getProfile);

module.exports = router;
