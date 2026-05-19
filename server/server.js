const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables from .env file
require("dotenv").config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────
app.use(cors());           // Allow cross-origin requests from the frontend
app.use(express.json());   // Parse incoming JSON request bodies


// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

// Auth routes        → /api/auth/register, /api/auth/login, /api/auth/me
app.use("/api/auth", require("./routes/authRoutes"));

// Career CRUD routes → /api/careers  (MongoDB-based: add, get all, get by ID, delete)
app.use("/api/careers", require("./routes/careerRoutes"));

// Career details     → /api/career-details/:careerName  (static data: description, salary, skills)
app.use("/api/career-details", require("./routes/careerDetailsRoutes"));

// Learning path      → /api/learning-path/:careerName  (static data: skills, courses, projects)
app.use("/api/learning-path", require("./routes/learningPathRoutes"));

// Dashboard          → /api/dashboard  (protected: requires JWT token)
app.use("/api/dashboard", require("./routes/dashboardRoutes"));


// ─────────────────────────────────────────────
// Root route — health check
// ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("✅ AI Career Guidance Backend is Running");
});


// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});