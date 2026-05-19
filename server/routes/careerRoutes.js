const express = require("express");
const router = express.Router();

// Import all career controller functions
const {
  addCareer,
  getAllCareers,
  getSingleCareer,
  deleteCareer,
} = require("../controllers/careerController");


// ─────────────────────────────────────────────
// Career Routes
// Base path: /api/careers  (set in server.js)
// ─────────────────────────────────────────────

// POST   /api/careers        → Add a new career
router.post("/", addCareer);

// GET    /api/careers        → Get all careers
router.get("/", getAllCareers);

// GET    /api/careers/:id    → Get a single career by ID
router.get("/:id", getSingleCareer);

// DELETE /api/careers/:id    → Delete a career by ID
router.delete("/:id", deleteCareer);


module.exports = router;
