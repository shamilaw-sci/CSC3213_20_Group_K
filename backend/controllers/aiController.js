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

    // Ask Gemini for recommendations
    const recommendation = await generateCareerRecommendation(profile);

    res.status(200).json({
      recommendation,
    });
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    const msg = (error && error.message && String(error.message)) || "";
    const lower = msg.toLowerCase();
    if (lower.includes("gemini") || lower.includes("gemini_api_key") || lower.includes("api key") || lower.includes("not configured")) {
      return res.status(503).json({ message: "AI service not configured or unavailable." });
    }

    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAIRecommendation,
};
