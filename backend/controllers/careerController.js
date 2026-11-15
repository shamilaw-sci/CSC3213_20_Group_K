const Career = require("../models/Career");

const getCareerDetails = async (req, res) => {
  try {
    const career = await Career.findOne({
      title: req.params.careerName,
    });

    if (!career) {
      return res.status(404).json({
        message: "Career not found",
      });
    }

    res.json(career);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getCareerDetails,
};