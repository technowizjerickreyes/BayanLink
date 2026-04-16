import express from "express";
import {
  addMunicipality,
  assignMunicipalAdminController,
  auditLogQueryValidators,
  browseAuditLogs,
  browseMunicipalities,
  editMunicipality,
  readMunicipality,
  superAdminDashboard,
} from "../controllers/superAdminController.js";
import requireAuth from "../middleware/requireAuth.js";
import requireRole from "../middleware/requireRole.js";
import { superAdminRateLimiter } from "../middleware/rateLimiters.js";
import validateRequest, { rejectUnknownBody } from "../middleware/validateRequest.js";
import { mongoIdParam } from "../validators/commonValidators.js";
import {
  assignMunicipalAdminAllowedFields,
  assignMunicipalAdminValidators,
  createMunicipalityValidators,
  municipalityCreateAllowedFields,
  municipalityListValidators,
  municipalityUpdateAllowedFields,
  updateMunicipalityValidators,
} from "../validators/municipalityValidators.js";

const router = express.Router();

router.use(requireAuth, requireRole("super_admin"), superAdminRateLimiter);

router.get("/dashboard", superAdminDashboard);
router.get("/audit-logs", auditLogQueryValidators, validateRequest, browseAuditLogs);
router.get("/municipalities", municipalityListValidators, validateRequest, browseMunicipalities);
router.post(
  "/municipalities",
  rejectUnknownBody(municipalityCreateAllowedFields),
  createMunicipalityValidators,
  validateRequest,
  addMunicipality
);
router.get("/municipalities/:id", mongoIdParam("id"), validateRequest, readMunicipality);
router.patch(
  "/municipalities/:id",
  mongoIdParam("id"),
  rejectUnknownBody(municipalityUpdateAllowedFields),
  updateMunicipalityValidators,
  validateRequest,
  editMunicipality
);
router.post(
  "/municipalities/:id/municipal-admin",
  mongoIdParam("id"),
  rejectUnknownBody(assignMunicipalAdminAllowedFields),
  assignMunicipalAdminValidators,
  validateRequest,
  assignMunicipalAdminController
);

export default router;
