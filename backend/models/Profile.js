const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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