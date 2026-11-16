const LearningPath = require("../models/LearningPath");

const getLearningPath = async (req, res) => {
  try {
    const learningPath =
      await LearningPath.findOne({
        career: req.params.careerName,
      });

    if (!learningPath) {
      return res.status(404).json({
        message: "Learning path not found",
      });
    }

    res.json(learningPath);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getLearningPath,
};