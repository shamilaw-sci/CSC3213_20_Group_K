const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: String,
  email: String,
  interest: String,
  skills: [String],
  education: String,
  careerGoal: String,
});

module.exports = mongoose.model(
  "Profile",
  profileSchema
);