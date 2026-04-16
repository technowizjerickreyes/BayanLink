import mongoose from "mongoose";

mongoose.set("strictQuery", true);

export default async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("MONGO_URI is not set. The API server is running without a database connection.");
    return null;
  }

  try {
    const connection = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
}
