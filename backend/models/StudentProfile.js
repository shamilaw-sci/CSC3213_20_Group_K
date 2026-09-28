/**
 * StudentProfile.js
 * ==================
 * Mongoose schema and model for Student Profile data.
 * Stores student information and preferences for career recommendations.
 */

const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    educationLevel: {
      type: String,
      enum: ["Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Self-Taught"],
      required: true,
    },
    preferredJobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Freelance"],
      required: true,
    },
    preferredWorkArea: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

module.exports = StudentProfile;
