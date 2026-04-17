import express from "express";
import {
  getPublicNews,
  getMunicipalityStats,
  getMunicipalityList,
  getBarangaysList,
  getServicesCatalog,
} from "../controllers/publicController.js";

const router = express.Router();

/**
 * Public routes - No authentication required
 */

// News endpoints
router.get("/news", getPublicNews);

// Municipality endpoints
router.get("/municipality/info", getMunicipalityList);
router.get("/municipality/stats", getMunicipalityStats);

// Barangays endpoint
router.get("/barangays", getBarangaysList);

// Services endpoint
router.get("/services/catalog", getServicesCatalog);

export default router;
