const Career = require("../models/Career");


// ─────────────────────────────────────────────
// @route   POST /api/careers
// @desc    Add a new career
// @access  Public (you can make it Private later with protect middleware)
// ─────────────────────────────────────────────
const addCareer = async (req, res) => {
  try {
    const { title, description, skillsRequired, salaryRange, category } = req.body;

    // Check all required fields are present
    if (!title || !description || !skillsRequired || !salaryRange || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create and save the new career to the database
    const career = await Career.create({
      title,
      description,
      skillsRequired,
      salaryRange,
      category,
    });

    res.status(201).json({
      message: "Career added successfully",
      career,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ─────────────────────────────────────────────
// @route   GET /api/careers
// @desc    Get all careers from the database
// @access  Public
// ─────────────────────────────────────────────
const getAllCareers = async (req, res) => {
  try {
    // Fetch all careers, newest first
    const careers = await Career.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Careers fetched successfully",
      count: careers.length,
      careers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ─────────────────────────────────────────────
// @route   GET /api/careers/:id
// @desc    Get a single career by its ID
// @access  Public
// ─────────────────────────────────────────────
const getSingleCareer = async (req, res) => {
  try {
    // req.params.id comes from the URL e.g. /api/careers/abc123
    const career = await Career.findById(req.params.id);

    // If no career is found with that ID
    if (!career) {
      return res.status(404).json({ message: "Career not found" });
    }

    res.status(200).json({
      message: "Career fetched successfully",
      career,
    });
  } catch (error) {
    // Handle invalid MongoDB ID format
    res.status(500).json({ message: error.message });
  }
};


// ─────────────────────────────────────────────
// @route   DELETE /api/careers/:id
// @desc    Delete a career by its ID
// @access  Public (you can add protect middleware to restrict to admins)
// ─────────────────────────────────────────────
const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    // Check if the career exists before trying to delete
    if (!career) {
      return res.status(404).json({ message: "Career not found" });
    }

    // Delete the career from the database
    await career.deleteOne();

    res.status(200).json({ message: "Career deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  addCareer,
  getAllCareers,
  getSingleCareer,
  deleteCareer,
};
