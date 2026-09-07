const Profile = require("../models/Profile");
const { generateChatResponse } = require("../services/geminiService");

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        message: "Message is required.",
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

    const response = await generateChatResponse(profile, message.trim());

    return res.status(200).json({ response });
  } catch (error) {
    console.error("AI Career Chat Error:", error);
    const msg = (error && error.message && String(error.message)) || "";
    const lower = msg.toLowerCase();
    if (lower.includes("gemini") || lower.includes("gemini_api_key") || lower.includes("api key") || lower.includes("not configured")) {
      return res.status(503).json({ message: "AI service not configured or unavailable." });
    }
    return res.status(500).json({ message: "Unable to generate an AI career response right now." });
  }
};

module.exports = {
  chatWithAI,
};
