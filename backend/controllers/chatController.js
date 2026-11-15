const Profile = require("../models/Profile");
const { generateChatResponse } = require("../services/geminiService");

const chatWithCareerAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        message: "A career-related message is required.",
      });
    }

    const profile = await Profile.findOne({
      userId: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found. Please create your profile first.",
      });
    }

    const reply = await generateChatResponse(profile, message.trim());

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Career Chat Error:", error);
    return res.status(500).json({
      message: "Unable to generate a career guidance response right now.",
    });
  }
};

module.exports = {
  chatWithCareerAI,
};
