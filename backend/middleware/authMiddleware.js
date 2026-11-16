const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const user = await User.findById(decoded.id).select("_id role");
      if (!user) {
        return res.status(401).json({ message: "Account no longer exists." });
      }
      req.user = { id: user._id.toString(), role: user.role || "student" };

      return next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "No token",
    });
  }
};

module.exports = protect;
