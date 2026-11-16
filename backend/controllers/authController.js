const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const publicUser = (user) => {
  const role = user.role === "user" || !user.role ? "student" : user.role;
  return { id: user._id, name: user.name, email: user.email, role };
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role: requestedRole = "student", adminInviteCode } = req.body;
    const role = String(requestedRole).toLowerCase();

    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string" || !name.trim() || !email.trim() || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!["student", "guide", "admin"].includes(role)) {
      return res.status(400).json({ message: "Choose a valid account type." });
    }
    if (role === "admin") {
      const configuredCode = process.env.ADMIN_REGISTRATION_KEY;
      if (!configuredCode || adminInviteCode !== configuredCode) {
        return res.status(403).json({ message: "A valid administrator invite code is required." });
      }
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      role,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const account = publicUser(user);
    return res.status(201).json({
      message: "Account created successfully. Opening your workspace…",
      token,
      user: account,
      role: account.role,
      name: account.name,
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "An account with this email already exists." });
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const account = publicUser(user);
    return res.status(200).json({
      message: "Login successful",
      token,
      user: account,
      role: account.role,
      name: account.name,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email role");
    if (!user) return res.status(404).json({ message: "Account not found." });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getCurrentUser };
