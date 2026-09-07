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

    let response;
    try {
      response = await generateChatResponse(profile, message.trim());
    } catch (error) {
      console.error("AI Career Chat Gemini Error:", error?.message || error);
      if (error?.code === "AI_SERVICE_UNAVAILABLE") {
        return res.status(503).json({ message: "AI service unavailable. Try again later." });
      }
      throw error;
    }

    return res.status(200).json({ response });
  } catch (error) {
    console.error("AI Career Chat Error:", error);
    return res.status(500).json({ message: "Unable to generate an AI career response right now." });
  }
};

module.exports = {
  chatWithAI,
};
