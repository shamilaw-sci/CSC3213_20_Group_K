const { GoogleGenAI, Type } = require("@google/genai");
const { CANONICAL_CAREERS, normalizeCareer } = require("./careerUtils");

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
};

const GEMINI_MODEL = process.env.GEMINI_MODEL || "models/gemini-3.6-flash";

const generateCareerRecommendation = async (profile) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  try {
    const skills = Array.isArray(profile.skills)
      ? profile.skills.join(", ")
      : "Not provided";

    const prompt = `You are an expert AI Career Advisor.\n\nStudent Profile:\nName: ${profile.name ||
      "Not provided"}\nEducation: ${profile.education || "Not provided"}\nInterest: ${profile.interest ||
      "Not provided"}\nSkills: ${skills}\nCareer Goal: ${profile.careerGoal || "Not provided"}\n\nReturn exactly 3 career recommendations.\nEach recommendation must use one of the following canonical career titles exactly as written (no variations): ${CANONICAL_CAREERS.join(
      ", ")}\nFor each recommendation include:\n1) career (one of the canonical titles above)\n2) matchPercentage (number 0-100)\n3) reason (short string)\n4) missingSkills (array of strings)\n5) suggestedLearningRoadmap (array of short strings)\nReturn valid JSON only with a top-level object { "recommendations": [ ... ] }.`;

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  career: { type: Type.STRING },
                  matchPercentage: { type: Type.INTEGER },
                  reason: { type: Type.STRING },
                  missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestedLearningRoadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["career", "matchPercentage", "reason", "missingSkills", "suggestedLearningRoadmap"],
              },
            },
          },
          required: ["recommendations"],
        },
      },
    });

    const parsed = JSON.parse(response.text || response.output?.[0]?.content || "{}");

    // Defensive normalization: map careers to canonical set and drop unknowns
    if (parsed && Array.isArray(parsed.recommendations)) {
      parsed.recommendations = parsed.recommendations
        .map((r) => ({ ...r, career: normalizeCareer(r.career) }))
        .filter((r) => r.career !== null);
    }

    return parsed;
  } catch (error) {
    console.error("Gemini Error:", error?.message || error);
    throw error;
  }
};

const generateChatResponse = async (profile, message) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  try {
    const skills = Array.isArray(profile.skills) ? profile.skills.join(", ") : "Not provided";

    const prompt = `You are an expert AI Career Advisor for an AI-Based Career Guidance System.\n\nStudent Profile:\nName: ${profile.name ||
      "Not provided"}\nEducation: ${profile.education || "Not provided"}\nInterest: ${profile.interest || "Not provided"}\nSkills: ${skills}\nCareer Goal: ${profile.careerGoal ||
      "Not provided"}\n\nUser question:\n${message}\n\nAnswer professionally and keep the response relevant to careers. Give practical, actionable advice tailored to the student's profile where appropriate. Be concise (150-300 words).`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini Chat Error:", error?.message || error);
    throw error;
  }
};

module.exports = {
  generateCareerRecommendation,
  generateChatResponse,
};
