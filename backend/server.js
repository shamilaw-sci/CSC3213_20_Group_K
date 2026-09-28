/**
 * server.js
 * ==========
 * Main entry point for the backend server.
 * Sets up Express with CORS and JSON middleware,
 * connects to MongoDB database,
 * and mounts the recommendation API routes.
 *
 * Author: Thimira (Student Profile & Career Recommendation Module)
 */

// ─── Load environment variables ────────────────────────────────
require("dotenv").config();

// ─── Import required packages ──────────────────────────────────
const express = require("express");   // Web framework for Node.js
const cors = require("cors");         // Middleware to allow cross-origin requests
const { connectDB } = require("./config/db");  // MongoDB connection

// ─── Create the Express app ────────────────────────────────────
const app = express();

// ─── Define the port ────────────────────────────────────────────
// Use the PORT from environment variables, or default to 5000
const PORT = process.env.PORT || 5000;

// ─── Middleware Setup ───────────────────────────────────────────

// Enable CORS so the frontend (running on a different port) can make requests
app.use(cors());

// Parse incoming JSON request bodies (e.g., from POST requests)
app.use(express.json());

// ─── Import Routes ──────────────────────────────────────────────
const recommendationRoutes = require("./routes/recommendationRoutes");
const studentRoutes = require("./routes/studentRoutes");

// ─── Admin Dashboard Routes ─────────────────────────────────────
const adminAuthRoutes      = require("./routes/admin/authRoutes");
const adminStudentRoutes   = require("./routes/admin/studentRoutes");
const adminCareerRoutes    = require("./routes/admin/careerRoutes");
const adminSkillRoutes     = require("./routes/admin/skillRoutes");
const adminResourceRoutes  = require("./routes/admin/resourceRoutes");
const adminFeedbackRoutes  = require("./routes/admin/feedbackRoutes");
const adminAnalyticsRoutes = require("./routes/admin/analyticsRoutes");
const adminSettingsRoutes  = require("./routes/admin/settingsRoutes");

// ─── Mount Routes ───────────────────────────────────────────────
// Recommendation routes: POST /api/recommendations
app.use("/api/recommendations", recommendationRoutes);

// Student profile routes: POST/GET/PUT/DELETE /api/students
app.use("/api/students", studentRoutes);

// Admin Dashboard API routes
app.use("/api/admin/auth",      adminAuthRoutes);
app.use("/api/admin/students",  adminStudentRoutes);
app.use("/api/admin/careers",   adminCareerRoutes);
app.use("/api/admin/skills",    adminSkillRoutes);
app.use("/api/admin/resources", adminResourceRoutes);
app.use("/api/admin/feedback",  adminFeedbackRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/admin/settings",  adminSettingsRoutes);

// ─── Root Route (Health Check) ──────────────────────────────────
// A simple GET route to verify the server is running
app.get("/", (req, res) => {
  res.json({
    message: "🎓 FuturePath AI — Career Guidance System API",
    status: "Running",
    endpoints: {
      recommendations:  "POST /api/recommendations",
      students:         "POST/GET/PUT/DELETE /api/students",
      adminAuth:        "POST /api/admin/auth/login",
      adminStudents:    "GET/POST/PUT/DELETE /api/admin/students",
      adminCareers:     "GET/POST/PUT/DELETE /api/admin/careers",
      adminSkills:      "GET/POST/PUT/DELETE /api/admin/skills",
      adminResources:   "GET/POST/PUT/DELETE /api/admin/resources",
      adminFeedback:    "GET/DELETE/PATCH /api/admin/feedback",
      adminAnalytics:   "GET /api/admin/analytics",
      adminSettings:    "GET/PUT /api/admin/settings",
    },
  });
});

// ─── Start the Server ───────────────────────────────────────────
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Only start the Express server after DB connection is successful
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📡 API endpoint: POST http://localhost:${PORT}/api/recommendations\n`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
