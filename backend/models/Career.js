const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  description: {
    type: String,
    maxlength: 5000,
  },
  salaryRange: {
    type: String,
    maxlength: 200,
  },
  requiredSkills: [{
    type: String,
    trim: true,
    maxlength: 80,
  }],
  futureScope: {
    type: String,
    maxlength: 3000,
  },
});

module.exports = mongoose.model(
  "Career",
  careerSchema
);