import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import barangayRoutes from "./routes/barangayRoutes.js";
import citizenRoutes from "./routes/citizenRoutes.js";
import municipalRoutes from "./routes/municipalRoutes.js";
import municipalityRoutes from "./routes/municipalityRoutes.js";
import newsFeedRoutes from "./routes/newsFeedRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import requireDatabase from "./middleware/requireDatabase.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import { getUploadsRootDirectory } from "./services/fileUploadService.js";

const app = express();

app.disable("x-powered-by");

if (env.isProduction) {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(cookieParser());
app.use("/uploads", express.static(getUploadsRootDirectory()));

app.get("/", (_req, res) => {
  res.send("BayanLink API is running");
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "BayanLink API is running" });
});

// Public API routes (no authentication required)
app.use("/api/public", publicRoutes);

app.use("/api/auth", requireDatabase, authRoutes);
app.use("/api/super-admin", requireDatabase, superAdminRoutes);
app.use("/api/municipal", requireDatabase, municipalRoutes);
app.use("/api/barangay", requireDatabase, barangayRoutes);
app.use("/api/citizen", requireDatabase, citizenRoutes);
app.use("/api/uploads", requireDatabase, uploadRoutes);

// Compatibility aliases for the original BayanLink template modules.
app.use("/api/municipalities", requireDatabase, municipalityRoutes);
app.use("/api/news-feeds", requireDatabase, newsFeedRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
