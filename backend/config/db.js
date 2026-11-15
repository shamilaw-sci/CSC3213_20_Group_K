const mongoose = require("mongoose");

const isMongoUri = (uri) =>
  typeof uri === "string" && /^mongodb(?:\+srv)?:\/\//i.test(uri.trim());

const hasMatchingConnectionIdentity = (primaryUri, directUri) => {
  try {
    const primary = new URL(primaryUri);
    const direct = new URL(directUri);
    const getDatabase = (uri) =>
      uri.searchParams.get("dbName") || uri.pathname.replace(/^\/+/, "") || "test";
    const getAuthSource = (uri) =>
      uri.searchParams.get("authSource") ||
      uri.pathname.replace(/^\/+/, "") ||
      "admin";

    return (
      decodeURIComponent(primary.username) === decodeURIComponent(direct.username) &&
      decodeURIComponent(primary.password) === decodeURIComponent(direct.password) &&
      getDatabase(primary) === getDatabase(direct) &&
      getAuthSource(primary) === getAuthSource(direct)
    );
  } catch {
    return false;
  }
};

const connectionError = () => {
  const error = new Error("MongoDB connection failed");
  error.code = "MONGODB_CONNECTION_FAILED";
  return error;
};

const logAttemptFailure = (attempt, error) => {
  const errorCode = error?.code;
  const safeCode =
    Number.isInteger(errorCode) ||
    (typeof errorCode === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(errorCode));
  const code = safeCode ? `, code ${errorCode}` : "";
  const errorName =
    typeof error?.name === "string" && /^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(error.name)
      ? error.name
      : "Error";
  console.error(`MongoDB ${attempt} connection failed (${errorName}${code}).`);
};

const isAuthenticationFailure = (error) => {
  const codeName = error?.codeName;
  const message = typeof error?.message === "string" ? error.message : "";
  return (
    error?.code === 18 ||
    codeName === "AuthenticationFailed" ||
    /bad auth|authentication failed/i.test(message)
  );
};

const disconnectAfterFailure = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    const errorName = typeof error?.name === "string" ? error.name : "Error";
    console.error(`MongoDB cleanup after connection failure also failed (${errorName}).`);
  }
};

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI?.trim();
  const directUri = process.env.MONGO_DIRECT_URI?.trim();

  if (!isMongoUri(primaryUri)) {
    console.error("MongoDB connection failed: MONGO_URI is missing or invalid.");
    throw connectionError();
  }

  try {
    await mongoose.connect(primaryUri);
    console.log("MongoDB connected using the primary URI.");
    return;
  } catch (error) {
    logAttemptFailure("primary", error);
    if (isAuthenticationFailure(error)) {
      console.error("MongoDB direct fallback skipped after an authentication failure.");
      await disconnectAfterFailure();
      throw connectionError();
    }
  }

  if (!directUri) {
    console.error("MongoDB connection failed: no direct fallback URI is configured.");
    await disconnectAfterFailure();
    throw connectionError();
  }

  if (!isMongoUri(directUri) || directUri === primaryUri) {
    console.error("MongoDB connection failed: the direct fallback URI is invalid.");
    await disconnectAfterFailure();
    throw connectionError();
  }

  if (!hasMatchingConnectionIdentity(primaryUri, directUri)) {
    console.error(
      "MongoDB direct fallback skipped because its database or authentication identity differs from the primary URI."
    );
    await disconnectAfterFailure();
    throw connectionError();
  }

  try {
    await mongoose.connect(directUri);
    console.log("MongoDB connected using the direct fallback URI.");
  } catch (error) {
    logAttemptFailure("direct fallback", error);
    console.error("MongoDB connection failed after both connection attempts.");
    await disconnectAfterFailure();
    throw connectionError();
  }
};

module.exports = connectDB;
