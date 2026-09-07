const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const learningPathRoutes = require("./routes/learningPathRoutes");
const careerRoutes = require("./routes/careerRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes");
const aiRoutes = require("./routes/aiRoutes");
const chatRoutes = require("./routes/chatRoutes");
const aiChatRoutes = require("./routes/aiChatRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const skillGapRoutes = require("./routes/skillGapRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/learning-path", learningPathRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai-chat", aiChatRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/skill-gap", skillGapRoutes);

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("AI Career Guidance API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
