const fs = require("fs/promises");
const { PDFParse } = require("pdf-parse");
const { analyzeResume: analyzeResumeText } = require("../services/resumeAnalyzerService");
const ResumeAnalysis = require("../models/ResumeAnalysis");

const extractResumeText = async (filePath) => {
  const fileData = await fs.readFile(filePath);
  const parser = new PDFParse({ data: fileData });

  try {
    const result = await parser.getText();
    return result.text.trim();
  } finally {
    await parser.destroy();
  }
};

const analyzeResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Please upload a PDF resume using the resume field.",
    });
  }

  try {
    const resumeText = await extractResumeText(req.file.path);

    if (!resumeText) {
      return res.status(400).json({
        message: "The uploaded PDF does not contain readable text.",
      });
    }

    let analysis;
    try {
      analysis = await analyzeResumeText(resumeText);
    } catch (err) {
      console.error("Resume Analyzer Error:", err?.message || err);
      if (err?.code === "AI_SERVICE_UNAVAILABLE") {
        return res.status(503).json({ message: "AI service unavailable. Try again later." });
      }
      return res.status(500).json({ message: "Unable to analyze the resume right now." });
    }

    await ResumeAnalysis.create({
      userId: req.user.id,
      ...analysis,
    });

    return res.status(200).json(analysis);
  } catch (error) {
    console.error("Resume Analysis Error:", error);
    return res.status(500).json({
      message: "Unable to analyze the resume right now.",
    });
  } finally {
    await fs.unlink(req.file.path).catch(() => {});
  }
};

const getResumeHistory = async (req, res) => {
  try {
    const history = await ResumeAnalysis.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ history });
  } catch (error) {
    console.error("Resume History Error:", error);
    return res.status(500).json({
      message: "Unable to load resume analysis history right now.",
    });
  }
};

module.exports = {
  analyzeResume,
  getResumeHistory,
};
