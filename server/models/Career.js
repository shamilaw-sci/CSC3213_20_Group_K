const mongoose = require("mongoose");

// ─────────────────────────────────────────────
// Career Schema
// Defines the shape of each career document in MongoDB
// ─────────────────────────────────────────────
const careerSchema = new mongoose.Schema(
  {
    // Job/career title e.g. "Software Engineer"
    title: {
      type: String,
      required: [true, "Career title is required"],
      trim: true,
    },

    // A short description of what this career involves
    description: {
      type: String,
      required: [true, "Description is required"],
    },

    // Array of skills needed e.g. ["JavaScript", "React", "Node.js"]
    skillsRequired: {
      type: [String],
      required: [true, "At least one skill is required"],
    },

    // Salary range as a string e.g. "$50,000 - $80,000"
    salaryRange: {
      type: String,
      required: [true, "Salary range is required"],
    },

    // Category/field e.g. "Technology", "Healthcare", "Finance"
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

module.exports = mongoose.model("Career", careerSchema);
