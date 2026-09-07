const Profile = require("../models/Profile");

const createProfile = async (req, res) => {
  try {
    const profile = await Profile.create({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json(profile);
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