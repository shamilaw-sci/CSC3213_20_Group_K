const User = require("../models/User");
const RecommendationHistory = require("../models/RecommendationHistory");

const getDashboard = async (req, res) => {
  try {
    const [user, totalRecommendations] = await Promise.all([
      User.findById(req.user.id),
      RecommendationHistory.countDocuments({ userId: req.user.id }),
    ]);

    res.status(200).json({
      message: "Welcome to Dashboard",
      name: user.name,
      email: user.email,
      totalRecommendations,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getDashboard
};