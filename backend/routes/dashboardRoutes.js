const express = require("express");

const router = express.Router();

const {
  getDashboard
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

router.get("/", protect, requireRole("student"), getDashboard);

module.exports = router;
