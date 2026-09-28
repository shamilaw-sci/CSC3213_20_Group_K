const Profile = require("../models/Profile");
const SkillGapAnalysis = require("../models/SkillGapAnalysis");
const { generateCareerRecommendation } = require("../services/geminiService");
const { calculateSkillGap } = require("../services/skillGapService");

const getSkillGap = async (req, res) => {
  try {
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
    } catch (err) {
      console.error("Skill Gap: Gemini error", err?.message || err);
      return res.status(503).json({ message: "AI service unavailable. Try again later." });
    }

    const recommendations = Array.isArray(recommendation?.recommendations)
      ? recommendation.recommendations
      : [];

    if (recommendations.length === 0) {
      return res.status(422).json({ message: "No career recommendations available." });
    }

    const primaryCareer = [...recommendations].sort((a, b) => Number(b.matchPercentage) - Number(a.matchPercentage))[0];

    if (!primaryCareer || !primaryCareer.career) {
      return res.status(422).json({ message: "Unable to determine a recommended career." });
    }

    // Normalize career to canonical name
    const { normalizeCareer } = require("../services/careerUtils");
    const normalized = normalizeCareer(primaryCareer.career);

    if (!normalized) {
      return res.status(422).json({ message: "Recommended career is not supported." });
    }

    const analysis = calculateSkillGap(normalized, profile.skills);

    await SkillGapAnalysis.create({ userId: req.user.id, ...analysis });

    return res.status(200).json(analysis);
  } catch (error) {
    console.error("Skill Gap Analysis Error:", error);
    return res.status(500).json({
      message: "Unable to generate skill gap analysis right now.",
    });
  }
};

module.exports = {
  getSkillGap,
};
