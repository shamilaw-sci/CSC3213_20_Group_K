/**
 * studentProfileController.js
 * =============================
 * Contains the logic for managing student profiles.
 * Handles CRUD operations for student data in MongoDB.
 */

const StudentProfile = require("../models/StudentProfile");

/**
 * POST /api/students
 * Create a new student profile
 */
const createStudentProfile = async (req, res) => {
  try {
    const { name, skills, interests, educationLevel, preferredJobType, preferredWorkArea } = req.body;

    // Validate required fields
    if (!name || !educationLevel || !preferredJobType || !preferredWorkArea) {
      return res.status(400).json({
        success: false,
        message: "Required fields: name, educationLevel, preferredJobType, preferredWorkArea",
      });
    }

    // Create new student profile
    const studentProfile = new StudentProfile({
      name,
      skills: skills || [],
      interests: interests || [],
      educationLevel,
      preferredJobType,
      preferredWorkArea,
    });

    const savedProfile = await studentProfile.save();

    console.log(`✅ Student profile created: ${name}`);

    res.status(201).json({
      success: true,
      message: "Student profile created successfully",
      studentProfile: savedProfile,
    });
  } catch (error) {
    console.error("❌ Error creating student profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while creating student profile",
    });
  }
};

/**
 * GET /api/students/:id
 * Retrieve a student profile by ID
 */
const getStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const studentProfile = await StudentProfile.findById(id);

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.status(200).json({
      success: true,
      studentProfile,
    });
  } catch (error) {
    console.error("❌ Error retrieving student profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving student profile",
    });
  }
};

/**
 * GET /api/students
 * Retrieve all student profiles
 */
const getAllStudentProfiles = async (req, res) => {
  try {
    const studentProfiles = await StudentProfile.find({});

    res.status(200).json({
      success: true,
      totalStudents: studentProfiles.length,
      studentProfiles,
    });
  } catch (error) {
    console.error("❌ Error retrieving student profiles:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving student profiles",
    });
  }
};

/**
 * PUT /api/students/:id
 * Update a student profile
 */
const updateStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const studentProfile = await StudentProfile.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    console.log(`✅ Student profile updated: ${studentProfile.name}`);

    res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      studentProfile,
    });
  } catch (error) {
    console.error("❌ Error updating student profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating student profile",
    });
  }
};

/**
 * DELETE /api/students/:id
 * Delete a student profile
 */
const deleteStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const studentProfile = await StudentProfile.findByIdAndDelete(id);

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    console.log(`✅ Student profile deleted: ${studentProfile.name}`);

    res.status(200).json({
      success: true,
      message: "Student profile deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting student profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while deleting student profile",
    });
  }
};

module.exports = {
  createStudentProfile,
  getStudentProfile,
  getAllStudentProfiles,
  updateStudentProfile,
  deleteStudentProfile,
};
