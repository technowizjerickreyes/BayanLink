import mongoose from "mongoose";

export default function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database connection is not available. Set MONGO_URI in server/.env.",
    });
  }

  return next();
}
