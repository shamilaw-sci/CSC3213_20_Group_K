/**
 * recommendationRoutes.js
 * ========================
 * Defines the API routes for career recommendations.
 * 
 * Routes:
 *   POST /api/recommendations — Get career recommendations based on student profile
 *
 * Author: Thimira (Student Profile & Career Recommendation Module)
 */

// Import Express and create a router instance
const express = require("express");
const router = express.Router();

// Import the controller that contains the recommendation logic
const { getRecommendations } = require("../controllers/recommendationController");

// ─── Define Routes ─────────────────────────────────────────────

/**
 * POST /api/recommendations
 * 
 * Accepts student profile data in the request body and returns
 * a list of recommended careers sorted by match percentage.
 * 
 * Request body example:
 *   {
 *     "name": "Thimira",
 *     "skills": ["JavaScript", "React"],
 *     "interests": ["Web Development"],
 *     "educationLevel": "Bachelor's Degree",
 *     "preferredJobType": "Full-Time",
 *     "preferredWorkArea": "Technology"
 *   }
 */
router.post("/", getRecommendations);

// Export the router so server.js can use it
module.exports = router;
