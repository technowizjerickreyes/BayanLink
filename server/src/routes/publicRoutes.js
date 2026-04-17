import express from "express";
import {
  getPublicNews,
  getMunicipalityStats,
  getMunicipalityInfo,
  getServicesCatalog,
} from "../controllers/publicController.js";

const router = express.Router();

/**
 * Public routes - No authentication required
 */

// News endpoints
router.get("/news", getPublicNews);

// Municipality endpoints
router.get("/municipality/info", getMunicipalityInfo);
router.get("/municipality/stats", getMunicipalityStats);

// Services endpoint
router.get("/services/catalog", getServicesCatalog);

export default router;
