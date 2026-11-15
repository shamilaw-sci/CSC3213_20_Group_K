const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);

    // If SRV DNS lookup is refused (common on some networks), allow fallback to a direct connection URI.
    if (process.env.MONGO_DIRECT_URI) {
      try {
        console.log("↪️  Attempting fallback MongoDB connection using MONGO_DIRECT_URI...");
        await mongoose.connect(process.env.MONGO_DIRECT_URI);
        console.log("✅ MongoDB Connected (direct host)");
        return;
      } catch (err2) {
        console.error('❌ Fallback connection failed:', err2.message);
      }
    }

    console.error("⚠️ Continuing without MongoDB connection (development mode).\n" +
      "If you expect the database to be available, check your MONGO_URI, network access, and Atlas IP whitelist.\n" +
      "To use a direct (non-SRV) connection as a fallback, add `MONGO_DIRECT_URI` to your .env with a mongodb:// URI.");
    // Do not exit the process here so the server can still run for frontend/API development.
  }
};

module.exports = connectDB;