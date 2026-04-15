import cors from "cors";
import express from "express";
import municipalityRoutes from "./routes/municipalityRoutes.js";
import newsFeedRoutes from "./routes/newsFeedRoutes.js";
import requireDatabase from "./middlewares/databaseMiddleware.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import notFound from "./middlewares/notFoundMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("BayanLink API is running");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "BayanLink API is running" });
});

app.use("/api/municipalities", requireDatabase, municipalityRoutes);
app.use("/api/news-feeds", requireDatabase, newsFeedRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
