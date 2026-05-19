const express = require("express");
const router = express.Router();

// Import controller functions
const { registerUser, loginUser, getMe } = require("../controllers/authController");

// Import the protect middleware (checks JWT token)
const { protect } = require("../middleware/authMiddleware");


// ─────────────────────────────────────────────
// Public Routes (no token needed)
// ─────────────────────────────────────────────

// POST /api/auth/register  →  Create a new account
router.post("/register", registerUser);

// POST /api/auth/login  →  Login and get a token
router.post("/login", loginUser);


// ─────────────────────────────────────────────
// Protected Routes (valid JWT token required)
// ─────────────────────────────────────────────

// GET /api/auth/me  →  Get current logged-in user
// "protect" runs first, verifies the token, then "getMe" runs
router.get("/me", protect, getMe);


module.exports = router;