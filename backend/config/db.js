/**
 * db.js
 * ============
 * Database connection module for MongoDB using Mongoose
 * 
 * This module handles the connection to MongoDB Atlas cluster
 */

const mongoose = require("mongoose");

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB Connected Successfully!");
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    if (error.message.includes("querySrv ENOTFOUND")) {
      console.log("⏳ Retrying MongoDB connection after DNS failure...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully on retry!");
        console.log(`📊 Database: ${mongoose.connection.name}`);
        return;
      } catch (retryError) {
        console.error("❌ MongoDB retry failed:", retryError.message);
      }
    }
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 * Useful for graceful shutdown
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("✅ MongoDB Disconnected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Disconnection Error:", error.message);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
