function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have access to this workspace." });
    }
    return next();
  };
}

module.exports = requireRole;
