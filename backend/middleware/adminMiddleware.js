
const adminOnly = (req, res, next) => {
  // User must already be authenticated by protect middleware
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  // Missing role is always treated as a normal user
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};

module.exports = adminOnly;
