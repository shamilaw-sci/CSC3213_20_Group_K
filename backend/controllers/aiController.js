const Profile = require("../models/Profile");
const { generateCareerRecommendation } = require("../services/geminiService");

const getAIRecommendation = async (req, res) => {
  try {
    // Get the logged-in user's profile
    const profile = await Profile.findOne({
      userId: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found. Please create your profile first.",
      });
    }

    let recommendation;
    try {
      recommendation = await generateCareerRecommendation(profile);
    } catch (error) {
      console.error("AI Recommendation Gemini Error:", error?.message || error);
      if (error?.code === "AI_SERVICE_UNAVAILABLE") {
        return res.status(503).json({ message: "AI service unavailable. Try again later." });
      }
      throw error;
    }

    res.status(200).json({
      recommendation,
    });
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAIRecommendation,
};
