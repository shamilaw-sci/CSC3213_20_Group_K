const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, ".env"),
  quiet: true,
});

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
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

app.use(cors());
app.use(express.json());
app.get("/health/ready", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  return res.status(connected ? 200 : 503).json({
    status: connected ? "ready" : "not_ready",
    database: connected ? "connected" : "disconnected",
  });
});

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
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("AI Career Guidance API Running...");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    const onError = (error) => reject(error);
    const onListening = () => {
      const address = server.address();
      if (!address) {
        reject(new Error("Server started without a listening address."));
        return;
      }

      const listeningOn = typeof address === "string" ? address : `port ${address.port}`;
      server.removeListener("error", onError);
      console.log(`Server started on ${listeningOn}`);
      resolve(server);
    };

    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(PORT);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    if (error.code === "MONGODB_CONNECTION_FAILED") {
      console.error("MongoDB connection failed. Server not started.");
    } else {
      console.error("Server failed to start.");
    }
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };
