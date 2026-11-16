const express = require("express");

const {
  getLearningPath,
} = require("../controllers/learningPathController");

const router = express.Router();

router.get("/:careerName", getLearningPath);

module.exports = router;