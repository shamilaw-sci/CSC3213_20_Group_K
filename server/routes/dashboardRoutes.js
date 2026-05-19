const express = require("express");
const router = express.Router();

// Import the dashboard controller
const { getDashboard } = require("../controllers/dashboardController");

// Import the protect middleware (verifies JWT token)
const { protect } = require("../middleware/authMiddleware");


// ─────────────────────────────────────────────
// Dashboard Routes
// Base path: /api/dashboard  (set in server.js)
// ─────────────────────────────────────────────

// GET /api/dashboard
// "protect" runs first → verifies token → attaches req.user
// Then getDashboard runs and returns the user's dashboard data
// This route is PROTECTED — a valid JWT token is required
router.get("/", protect, getDashboard);


module.exports = router;
