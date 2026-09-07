const mongoose = require("mongoose");

const learningPathSchema = new mongoose.Schema({
  career: String,

  skills: [String],

  courses: [String],

  projects: [String],

  resources: [String],
});

module.exports = mongoose.model(
  "LearningPath",
  learningPathSchema
);