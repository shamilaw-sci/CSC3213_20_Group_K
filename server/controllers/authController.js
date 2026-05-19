const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ─────────────────────────────────────────────
// Helper: Generate a JWT token for a user
// The token contains the user's ID and expires in 7 days
// ─────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },           // Payload: what we store inside the token
    process.env.JWT_SECRET,   // Secret key from .env
    { expiresIn: "7d" }       // Token expires after 7 days
  );
};


// ─────────────────────────────────────────────
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public (no login needed)
// ─────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash the password before saving (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Return user info + a JWT token so they can log in right away
    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ─────────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login an existing user
// @access  Public (no login needed)
// ─────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check both fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Compare the entered password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Login successful — return user info + JWT token
    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ─────────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Get the currently logged-in user's profile
// @access  Private (requires valid JWT token)
// ─────────────────────────────────────────────
const getMe = async (req, res) => {
  // req.user is set by the authMiddleware BEFORE this function runs
  // It already contains the full user object (minus the password)
  res.status(200).json({
    message: "User profile fetched",
    user: req.user,
  });
};


module.exports = {
  registerUser,
  loginUser,
  getMe,
};