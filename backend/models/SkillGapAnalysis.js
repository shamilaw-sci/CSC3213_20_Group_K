const mongoose = require("mongoose");

const skillGapAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  career: {
    type: String,
    required: true,
  },
  currentSkills: [String],
  missingSkills: [String],
  readinessScore: Number,
  learningPriority: [String],
});

module.exports = mongoose.model(
  "SkillGapAnalysis",
  skillGapAnalysisSchema
);