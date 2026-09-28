const Profile = require("../models/Profile");

const createProfile = async (req, res) => {
  try {
    const { name, email, interest, skills, education, careerGoal } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          name,
          email,
          interest,
          skills,
          education,
          careerGoal,
        },
        $setOnInsert: { userId: req.user.id },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      userId: req.user.id,
    });

    res.json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
};