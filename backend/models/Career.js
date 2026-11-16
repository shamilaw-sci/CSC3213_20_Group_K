const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema({
  title: String,

  description: String,

  salaryRange: String,

  requiredSkills: [String],

  futureScope: String,
});

module.exports = mongoose.model(
  "Career",
  careerSchema
);