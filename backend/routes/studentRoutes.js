/**
 * studentRoutes.js
 * =================
 * Routes for student profile management.
 * Handles all CRUD operations for student profiles.
 */

const express = require("express");
const {
  createStudentProfile,
  getStudentProfile,
  getAllStudentProfiles,
  updateStudentProfile,
  deleteStudentProfile,
} = require("../controllers/studentProfileController");

const router = express.Router();

// GET all student profiles
router.get("/", getAllStudentProfiles);

// POST create a new student profile
router.post("/", createStudentProfile);

// GET a specific student profile by ID
router.get("/:id", getStudentProfile);

// PUT update a student profile
router.put("/:id", updateStudentProfile);

// DELETE a student profile
router.delete("/:id", deleteStudentProfile);

module.exports = router;
