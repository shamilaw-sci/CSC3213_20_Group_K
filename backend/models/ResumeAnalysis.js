const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    atsScore: Number,
    summary: String,
    strengths: [String],
    weaknesses: [String],
    missingSkills: [String],
    careerMatches: [String],
    recommendedCertifications: [String],
    recommendedCourses: [String],
    portfolioProjects: [String],
    resumeImprovements: [String],
    interviewPreparation: [String],
    next30DaysPlan: [String],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
