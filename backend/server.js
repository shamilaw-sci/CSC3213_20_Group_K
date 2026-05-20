/**
 * server.js
 * ==========
 * Main entry point for the backend server.
 * Sets up Express with CORS and JSON middleware,
 * and mounts the recommendation API routes.
 *
 * Author: Thimira (Student Profile & Career Recommendation Module)
 */

// ─── Import required packages ──────────────────────────────────
const express = require("express");   // Web framework for Node.js
const cors = require("cors");         // Middleware to allow cross-origin requests

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

// ─── Mount Routes ───────────────────────────────────────────────
// All recommendation-related routes will be prefixed with /api/recommendations
// Example: POST /api/recommendations
app.use("/api/recommendations", recommendationRoutes);

// ─── Root Route (Health Check) ──────────────────────────────────
// A simple GET route to verify the server is running
app.get("/", (req, res) => {
  res.json({
    message: "🎓 FuturePath AI — Career Guidance System API",
    status: "Running",
    endpoints: {
      recommendations: "POST /api/recommendations",
    },
  });
});

// ─── Start the Server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: POST http://localhost:${PORT}/api/recommendations\n`);
});
