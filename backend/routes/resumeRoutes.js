const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const {
  analyzeResume,
  getResumeHistory,
} = require("../controllers/resumeController");

const uploadDirectory = path.join(__dirname, "..", "uploads", "resumes");
fs.mkdirSync(uploadDirectory, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, callback) => {
      callback(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype === "application/pdf") {
      callback(null, true);
    } else {
      callback(new Error("Only PDF files are allowed."));
    }
  },
});

const uploadResume = (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Resume file must not exceed 5 MB.",
      });
    }

    return res.status(400).json({
      message: error.message || "Resume upload failed.",
    });
  });
};

const router = express.Router();

// POST /api/resume/analyze
router.post("/analyze", protect, requireRole("student"), uploadResume, analyzeResume);

// GET /api/resume/history
router.get("/history", protect, requireRole("student"), getResumeHistory);

module.exports = router;
