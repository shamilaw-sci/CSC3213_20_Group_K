
const mongoose = require("mongoose");

const User = require("../models/User");
const Career = require("../models/Career");
const Profile = require("../models/Profile");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const RecommendationHistory = require("../models/RecommendationHistory");
const SkillGapAnalysis = require("../models/SkillGapAnalysis");

const MAX_PAGE_SIZE = 100;

const parsePositiveInteger = (value, defaultValue) => {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 1. Dashboard statistics
const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalCareers,
      totalResumeAnalyses,
      totalSkillGapAnalyses,
      recentUsers,
      recentResumeAnalyses,
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: "admin" } }),
      User.countDocuments({ role: "admin" }),
      Career.countDocuments(),
      ResumeAnalysis.countDocuments(),
      SkillGapAnalysis.countDocuments(),
      User.find({ role: { $ne: "admin" } })
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(5),
      ResumeAnalysis.find()
        .select("userId atsScore careerMatches createdAt")
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      totalUsers,
      totalAdmins,
      totalCareers,
      totalResumeAnalyses,
      totalSkillGapAnalyses,
      recentUsers,
      recentResumeAnalyses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Search, filter, and paginate users
const getAllUsers = async (req, res) => {
  try {
    const { search: rawSearch, role: requestedRole } = req.query;
    const role = requestedRole === undefined ? "all" : requestedRole;
    const page = parsePositiveInteger(req.query.page, 1);
    const pageSize = parsePositiveInteger(req.query.pageSize, 10);

    if (page === null || pageSize === null || pageSize > MAX_PAGE_SIZE) {
      return res.status(400).json({
        message: `Page and pageSize must be positive integers; pageSize cannot exceed ${MAX_PAGE_SIZE}.`,
      });
    }

    if (!["all", "student", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Role must be all, student, or admin.",
      });
    }

    if (rawSearch !== undefined && typeof rawSearch !== "string") {
      return res.status(400).json({ message: "Search must be a string." });
    }

    const search = rawSearch?.trim() || "";

    if (search.length > 100) {
      return res.status(400).json({
        message: "Search cannot exceed 100 characters.",
      });
    }

    const filter = {};

    if (role === "student") {
      filter.role = { $ne: "admin" };
    } else if (role === "admin") {
      filter.role = "admin";
    }

    if (search) {
      const escapedSearch = escapeRegex(search);
      filter.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / pageSize);
    const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages);
    const users = await User.find(filter)
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.json({
      users,
      pagination: {
        page: currentPage,
        pageSize,
        totalUsers,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get a user's profile and analysis history
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id)
      .select("name email role createdAt")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [profile, resumeAnalyses, skillGapAnalyses] = await Promise.all([
      Profile.findOne({ userId: id })
        .select("name email interest skills education careerGoal")
        .lean(),
      ResumeAnalysis.find({ userId: id })
        .select("atsScore summary careerMatches createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      SkillGapAnalysis.find({ userId: id })
        .select("career currentSkills missingSkills readinessScore learningPriority")
        .sort({ _id: -1 })
        .lean(),
    ]);

    res.json({ user, profile, resumeAnalyses, skillGapAnalyses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Search, paginate, and view saved CV analyses
const getAllResumeAnalyses = async (req, res) => {
  try {
    const { search: rawSearch } = req.query;
    const page = parsePositiveInteger(req.query.page, 1);
    const pageSize = parsePositiveInteger(req.query.pageSize, 10);

    if (page === null || pageSize === null || pageSize > MAX_PAGE_SIZE) {
      return res.status(400).json({
        message: `Page and pageSize must be positive integers; pageSize cannot exceed ${MAX_PAGE_SIZE}.`,
      });
    }

    if (rawSearch !== undefined && typeof rawSearch !== "string") {
      return res.status(400).json({ message: "Search must be a string." });
    }

    const search = rawSearch?.trim() || "";
    if (search.length > 100) {
      return res.status(400).json({
        message: "Search cannot exceed 100 characters.",
      });
    }

    const filter = {};
    if (search) {
      const escapedSearch = escapeRegex(search);
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: escapedSearch, $options: "i" } },
          { email: { $regex: escapedSearch, $options: "i" } },
        ],
      })
        .select("_id")
        .lean();

      filter.userId = { $in: matchingUsers.map((user) => user._id) };
    }

    const totalAnalyses = await ResumeAnalysis.countDocuments(filter);
    const totalPages = Math.ceil(totalAnalyses / pageSize);
    const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages);
    const analyses = await ResumeAnalysis.find(filter)
      .select("userId atsScore summary careerMatches createdAt")
      .populate({ path: "userId", select: "name email" })
      .sort({ createdAt: -1, _id: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.json({
      analyses,
      pagination: {
        page: currentPage,
        pageSize,
        totalAnalyses,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResumeAnalysisDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid CV analysis ID" });
    }

    const analysis = await ResumeAnalysis.findById(id)
      .select(
        "userId atsScore summary strengths weaknesses missingSkills careerMatches recommendedCertifications recommendedCourses portfolioProjects resumeImprovements interviewPreparation next30DaysPlan createdAt"
      )
      .populate({ path: "userId", select: "name email" })
      .lean();

    if (!analysis) {
      return res.status(404).json({ message: "CV analysis not found" });
    }

    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRecommendationHistory = async (req, res) => {
  try {
    const { search: rawSearch } = req.query;
    const page = parsePositiveInteger(req.query.page, 1);
    const pageSize = parsePositiveInteger(req.query.pageSize, 10);

    if (page === null || pageSize === null || pageSize > MAX_PAGE_SIZE) {
      return res.status(400).json({
        message: `Page and pageSize must be positive integers; pageSize cannot exceed ${MAX_PAGE_SIZE}.`,
      });
    }

    if (rawSearch !== undefined && typeof rawSearch !== "string") {
      return res.status(400).json({ message: "Search must be a string." });
    }

    const search = rawSearch?.trim() || "";
    if (search.length > 100) {
      return res.status(400).json({
        message: "Search cannot exceed 100 characters.",
      });
    }

    const filter = {};
    if (search) {
      const escapedSearch = escapeRegex(search);
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: escapedSearch, $options: "i" } },
          { email: { $regex: escapedSearch, $options: "i" } },
        ],
      })
        .select("_id")
        .lean();

      filter.userId = { $in: matchingUsers.map((user) => user._id) };
    }

    const totalHistories = await RecommendationHistory.countDocuments(filter);
    const totalPages = Math.ceil(totalHistories / pageSize);
    const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages);
    const histories = await RecommendationHistory.find(filter)
      .select("userId recommendations.career recommendations.matchPercentage createdAt")
      .populate({ path: "userId", select: "name email" })
      .sort({ createdAt: -1, _id: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.json({
      histories,
      pagination: {
        page: currentPage,
        pageSize,
        totalHistories,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecommendationHistoryDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid recommendation history ID" });
    }

    const history = await RecommendationHistory.findById(id)
      .select("userId recommendations createdAt")
      .populate({ path: "userId", select: "name email" })
      .lean();

    if (!history) {
      return res.status(404).json({ message: "Recommendation history not found" });
    }

    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Delete a user and their related records
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (new mongoose.Types.ObjectId(id).equals(req.user._id)) {
      return res.status(400).json({
        message: "You cannot delete your own admin account",
      });
    }

    let session;
    let deletionError = null;

    try {
      session = await mongoose.startSession();
      await session.withTransaction(async () => {
        deletionError = null;
        const user = await User.findById(id).session(session);

        if (!user) {
          deletionError = { status: 404, message: "User not found" };
          return;
        }

        if (user.role === "admin") {
          const adminCount = await User.countDocuments({ role: "admin" }).session(session);

          if (adminCount <= 1) {
            deletionError = {
              status: 400,
              message: "Cannot delete the last admin account",
            };
            return;
          }

          const deletionLock = await User.findOne({ role: "admin" })
            .select("_id")
            .sort({ _id: 1 })
            .session(session);

          if (!deletionLock) {
            deletionError = {
              status: 409,
              message: "The administrator list changed. Please retry the deletion.",
            };
            return;
          }

          const lockResult = await User.updateOne(
            { _id: deletionLock._id },
            { $inc: { adminDeletionLockVersion: 1 } },
            { session, timestamps: false }
          );

          if (lockResult.matchedCount !== 1) {
            deletionError = {
              status: 409,
              message: "The administrator list changed. Please retry the deletion.",
            };
            return;
          }
        }

        await Profile.deleteMany({ userId: id }, { session });
        await ResumeAnalysis.deleteMany({ userId: id }, { session });
        await RecommendationHistory.deleteMany({ userId: id }, { session });
        await SkillGapAnalysis.deleteMany({ userId: id }, { session });
        await User.deleteOne({ _id: id }, { session });
      });

      if (deletionError) {
        return res.status(deletionError.status).json({
          message: deletionError.message,
        });
      }

      return res.json({ message: "User and related records deleted successfully" });
    } finally {
      if (session) {
        await session.endSession();
      }
    }
  } catch (error) {
    console.error("Admin user deletion failed:", error);
    res.status(500).json({ message: error.message });
  }
};

// 4. Get all careers
const getAllCareers = async (req, res) => {
  try {
    const { search: rawSearch } = req.query;
    const page = parsePositiveInteger(req.query.page, 1);
    const pageSize = parsePositiveInteger(req.query.pageSize, 10);

    if (page === null || pageSize === null || pageSize > MAX_PAGE_SIZE) {
      return res.status(400).json({
        message: `Page and pageSize must be positive integers; pageSize cannot exceed ${MAX_PAGE_SIZE}.`,
      });
    }

    if (rawSearch !== undefined && typeof rawSearch !== "string") {
      return res.status(400).json({ message: "Search must be a string." });
    }

    const search = rawSearch?.trim() || "";

    if (search.length > 100) {
      return res.status(400).json({
        message: "Search cannot exceed 100 characters.",
      });
    }

    const filter = {};

    if (search) {
      const escapedSearch = escapeRegex(search);
      filter.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
        { salaryRange: { $regex: escapedSearch, $options: "i" } },
        { requiredSkills: { $regex: escapedSearch, $options: "i" } },
        { futureScope: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const totalCareers = await Career.countDocuments(filter);
    const totalPages = Math.ceil(totalCareers / pageSize);
    const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages);
    const careers = await Career.find(filter)
      .sort({ title: 1, _id: 1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.json({
      careers,
      pagination: {
        page: currentPage,
        pageSize,
        totalCareers,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const normalizeCareerInput = (body, partial = false) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Career details must be provided as an object." };
  }

  const updates = {};
  const textLimits = {
    description: 5000,
    salaryRange: 200,
    futureScope: 3000,
  };

  if (!partial || body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return { error: "Career title is required." };
    }
    if (body.title.trim().length > 150) {
      return { error: "Career title cannot exceed 150 characters." };
    }
    updates.title = body.title.trim();
  }

  for (const [field, maxLength] of Object.entries(textLimits)) {
    if (body[field] === undefined && partial) {
      continue;
    }

    const value = body[field] ?? "";
    if (typeof value !== "string") {
      return { error: `${field} must be a string.` };
    }
    if (value.trim().length > maxLength) {
      return { error: `${field} cannot exceed ${maxLength} characters.` };
    }
    updates[field] = value.trim();
  }

  if (body.requiredSkills === undefined && partial) {
    return { updates };
  }

  const requiredSkills = body.requiredSkills ?? [];
  if (!Array.isArray(requiredSkills) || requiredSkills.length > 100) {
    return { error: "Required skills must be a list of at most 100 items." };
  }

  const normalizedSkills = [];
  for (const skill of requiredSkills) {
    if (typeof skill !== "string" || skill.trim().length > 80) {
      return { error: "Each required skill must be a string of at most 80 characters." };
    }
    if (skill.trim()) {
      normalizedSkills.push(skill.trim());
    }
  }
  updates.requiredSkills = normalizedSkills;

  return { updates };
};

// 5. Add a career
const createCareer = async (req, res) => {
  try {
    const { updates, error } = normalizeCareerInput(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const existingCareer = await Career.findOne({
      title: {
        $regex: `^${escapeRegex(updates.title)}$`,
        $options: "i",
      },
    });

    if (existingCareer) {
      return res.status(409).json({
        message: "A career with this title already exists",
      });
    }

    const career = await Career.create(updates);

    res.status(201).json({
      message: "Career created successfully",
      career,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Update a career
const updateCareer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid career ID" });
    }

    const { updates, error } = normalizeCareerInput(req.body, true);
    if (error) {
      return res.status(400).json({ message: error });
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "At least one career field must be provided.",
      });
    }

    if (updates.title !== undefined) {
      const duplicate = await Career.findOne({
        title: {
          $regex: `^${escapeRegex(updates.title)}$`,
          $options: "i",
        },
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(409).json({
          message: "Another career already uses this title",
        });
      }
    }

    const career = await Career.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!career) {
      return res.status(404).json({ message: "Career not found" });
    }

    res.json({
      message: "Career updated successfully",
      career,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. Delete a career
const deleteCareer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid career ID" });
    }

    const career = await Career.findByIdAndDelete(id);

    if (!career) {
      return res.status(404).json({ message: "Career not found" });
    }

    res.json({ message: "Career deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getUserDetails,
  getAllResumeAnalyses,
  getResumeAnalysisDetails,
  getAllRecommendationHistory,
  getRecommendationHistoryDetails,
  deleteUser,
  getAllCareers,
  createCareer,
  updateCareer,
  deleteCareer,
};
