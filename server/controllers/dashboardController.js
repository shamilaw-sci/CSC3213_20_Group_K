// ─────────────────────────────────────────────
// @route   GET /api/dashboard
// @desc    Return the logged-in user's dashboard summary
// @access  Private — requires valid JWT token
//
// How it works:
//   1. The "protect" middleware in authMiddleware.js runs FIRST
//   2. It reads the token from the Authorization header
//   3. It decodes the token and attaches the user to req.user
//   4. THEN this function runs and reads from req.user
// ─────────────────────────────────────────────
const getDashboard = async (req, res) => {
  try {
    // req.user is already populated by the protect middleware
    // It contains the full user object (without password)
    const { name, email } = req.user;

    // Future feature: count how many career recommendations
    // this user has saved. For now we return 0 as a placeholder.
    // Later you can query a Recommendation model here.
    const recommendationCount = 0;

    res.status(200).json({
      message: `Welcome back, ${name}! 👋`,
      userName: name,
      email: email,
      recommendationCount: recommendationCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard };
