const { GoogleGenAI, Type } = require("@google/genai");

const analyzeResume = async (resumeText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const model = process.env.GEMINI_MODEL || "models/gemini-3.6-flash";

  const prompt = `You are an expert ATS resume reviewer and career advisor. Analyse the resume text below objectively and return a JSON object with the fields requested. Be concise and include practical, specific advice based only on the resume.\n\nResume text:\n---\n${resumeText}\n---`;

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
};

module.exports = {
  analyzeResume,
};
