const { GoogleGenAI, Type } = require("@google/genai");

const createGeminiError = (message, cause) => {
  const error = new Error(message);
  error.code = "AI_SERVICE_UNAVAILABLE";
  error.cause = cause;
  return error;
};

const analyzeResume = async (resumeText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw createGeminiError("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

  const prompt = `You are an expert ATS resume reviewer and career advisor. Analyse the resume text below objectively and return a JSON object with the fields requested. Be concise and include practical, specific advice based only on the resume.\n\nResume text:\n---\n${resumeText}\n---`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
        type: Type.OBJECT,
        properties: {
          atsScore: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          careerMatches: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendedCertifications: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendedCourses: { type: Type.ARRAY, items: { type: Type.STRING } },
          portfolioProjects: { type: Type.ARRAY, items: { type: Type.STRING } },
          resumeImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
          interviewPreparation: { type: Type.ARRAY, items: { type: Type.STRING } },
          next30DaysPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: [
          "atsScore",
          "summary",
          "strengths",
          "weaknesses",
          "missingSkills",
          "careerMatches",
          "recommendedCertifications",
          "recommendedCourses",
          "portfolioProjects",
          "resumeImprovements",
          "interviewPreparation",
          "next30DaysPlan",
        ],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    throw createGeminiError("Gemini resume analysis request failed", error);
  }
};

module.exports = {
  analyzeResume,
};
