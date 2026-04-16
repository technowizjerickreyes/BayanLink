import mongoose from "mongoose";
import { env } from "./env.js";

mongoose.set("strictQuery", true);

export default async function connectDB() {
  if (!env.mongoUri) {
    console.warn("MONGO_URI is not set. The API server is running without a database connection.");
    return null;
  }

  try {
    const connection = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
}
