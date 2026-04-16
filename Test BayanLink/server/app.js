import cors from "cors";
import express from "express";
import municipalityRoutes from "./routes/municipalityRoutes.js";
import newsFeedRoutes from "./routes/newsFeedRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js"; 

import requireDatabase from "./middlewares/databaseMiddleware.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import notFound from "./middlewares/notFoundMiddleware.js";
import staffRoutes from "./routes/staffRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("BayanLink API is running");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "BayanLink API is running" });
});

// 2. Register the route with a clean URL prefix
app.use("/api/municipalities", requireDatabase, municipalityRoutes);
app.use("/api/news-feeds", requireDatabase, newsFeedRoutes);
app.use("/api/departments", requireDatabase, departmentRoutes); 
app.use("/api/staff", requireDatabase, staffRoutes);
app.use("/api/users", requireDatabase, userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;