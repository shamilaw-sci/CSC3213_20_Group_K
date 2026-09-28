const User = require("../models/User");

const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      message: "Welcome to Dashboard",
      name: user.name,
      email: user.email,
      totalRecommendations: 5
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