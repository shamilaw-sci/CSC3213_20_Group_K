const mongoose = require("mongoose");

const careerRecommendationSchema = new mongoose.Schema(
  {
    career: String,
    matchPercentage: Number,
    reason: String,
    missingSkills: [String],
    suggestedLearningRoadmap: [String],
    category: String,
    estimatedSalaryRange: String,
    salaryRange: String,
    futureDemand: String,
    detailedExplanation: String,
    careerGrowth: String,
    industryOutlook: String,
    advantages: [String],
    challenges: [String],
    recommendedCertifications: [String],
    certifications: [String],
    suggestedPortfolioProjects: [String],
    portfolioProjects: [String],
  },
  { _id: false }
);

const recommendationHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recommendations: {
      type: [careerRecommendationSchema],
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model("RecommendationHistory", recommendationHistorySchema);
