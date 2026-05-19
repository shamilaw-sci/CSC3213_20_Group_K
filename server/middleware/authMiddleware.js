const jwt = require("jsonwebtoken");
const User = require("../models/User");

// This middleware checks if the user is logged in
// It reads the token from the Authorization header
// Format: "Bearer <token>"

const protect = async (req, res, next) => {
  let token;

  // Step 1: Check if the Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Step 2: Extract the token (remove "Bearer " from the string)
      token = req.headers.authorization.split(" ")[1];

      // Step 3: Verify the token using our JWT_SECRET from .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Step 4: Find the user by the ID stored inside the token
      // We exclude the password field so it's never sent to the frontend
      req.user = await User.findById(decoded.id).select("-password");

      // Step 5: Pass control to the next function (the actual route handler)
      next();
    } catch (error) {
      // Token is invalid or expired
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // No token was provided at all
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
