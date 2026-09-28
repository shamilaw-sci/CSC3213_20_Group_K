/**
 * test-mongo.js
 * =================
 * Simple MongoDB connection test script using Mongoose.
 * Run this from the backend folder to verify that the
 * database connection string works correctly.
 */

require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("ERROR: MONGODB_URI is not defined in .env");
  process.exit(1);
}

const connectTest = async () => {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connection successful!");
    console.log(`Database name: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

connectTest();
