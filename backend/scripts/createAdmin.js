/**
 * One-time admin promotion script.
 * Usage:
 *   node backend/scripts/createAdmin.js <email>
 *
 * This script promotes an existing user to the "admin" role.
 * It is NEVER exposed through any API route.
 * Run from the project root directory.
 */

const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../config/db");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
  quiet: true,
});

const User = require("../models/User");

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node backend/scripts/createAdmin.js <email>");
    process.exit(1);
  }

  await connectDB();
  console.log("Connected to MongoDB.");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.error(`No user found with email: ${email}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  if (user.role === "admin") {
    console.log(`User "${user.name}" (${email}) is already an admin.`);
    await mongoose.disconnect();
    return;
  }

  user.role = "admin";
  await user.save();
  console.log(`Success! "${user.name}" (${email}) has been promoted to admin.`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Script error:", err.message);
  process.exit(1);
});
