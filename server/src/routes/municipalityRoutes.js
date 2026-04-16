import express from "express";
import {
  addMunicipality,
  browseMunicipalities,
  editMunicipality,
  readMunicipality,
} from "../controllers/superAdminController.js";
import requireAuth from "../middleware/requireAuth.js";
import requireRole from "../middleware/requireRole.js";
import { superAdminRateLimiter } from "../middleware/rateLimiters.js";
import validateRequest, { rejectUnknownBody } from "../middleware/validateRequest.js";
import { mongoIdParam } from "../validators/commonValidators.js";
import {
  createMunicipalityValidators,
  municipalityCreateAllowedFields,
  municipalityListValidators,
  municipalityUpdateAllowedFields,
  updateMunicipalityValidators,
} from "../validators/municipalityValidators.js";

const router = express.Router();

router.use(requireAuth, requireRole("super_admin"), superAdminRateLimiter);

router.get("/", municipalityListValidators, validateRequest, browseMunicipalities);
router.post("/", rejectUnknownBody(municipalityCreateAllowedFields), createMunicipalityValidators, validateRequest, addMunicipality);
router.get("/:id", mongoIdParam("id"), validateRequest, readMunicipality);
router.patch(
  "/:id",
  mongoIdParam("id"),
  rejectUnknownBody(municipalityUpdateAllowedFields),
  updateMunicipalityValidators,
  validateRequest,
  editMunicipality
);
router.put(
  "/:id",
  mongoIdParam("id"),
  rejectUnknownBody(municipalityUpdateAllowedFields),
  updateMunicipalityValidators,
  validateRequest,
  editMunicipality
);

export default router;
