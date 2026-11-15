
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  getAdminStats,
  getAllUsers,
  getUserDetails,
  getAllResumeAnalyses,
  getResumeAnalysisDetails,
  getAllRecommendationHistory,
  getRecommendationHistoryDetails,
  deleteUser,
  getAllCareers,
  createCareer,
  updateCareer,
  deleteCareer,
} = require("../controllers/adminController");

// All routes below require a valid login AND admin role
router.use(protect, adminOnly);

// Dashboard
router.get("/stats", getAdminStats);

// User management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserDetails);
router.delete("/users/:id", deleteUser);

// CV analysis management
router.get("/resume-analyses", getAllResumeAnalyses);
router.get("/resume-analyses/:id", getResumeAnalysisDetails);

// AI recommendation history
router.get("/recommendations", getAllRecommendationHistory);
router.get("/recommendations/:id", getRecommendationHistoryDetails);

// Career management
router.get("/careers", getAllCareers);
router.post("/careers", createCareer);
router.put("/careers/:id", updateCareer);
router.delete("/careers/:id", deleteCareer);

module.exports = router;
