import { query } from "express-validator";
import { AUDIT_ACTIONS } from "../models/AuditLog.js";
import { getSuperAdminDashboardData } from "../services/dashboardService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";
import { sendSuccess } from "../utils/apiResponse.js";
import {
  assignMunicipalAdmin,
  createMunicipality,
  getMunicipalityWithAudit,
  listMunicipalities,
  listMunicipalityAuditLogs,
  updateMunicipality,
} from "../services/municipalityService.js";

export const auditLogQueryValidators = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100").toInt(),
  query("targetId").optional().isMongoId().withMessage("Target id is invalid"),
  query("actionType").optional().isIn(AUDIT_ACTIONS).withMessage("Action type is invalid"),
];

export const browseMunicipalities = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.validated.query);
  const result = await listMunicipalities({ query: req.validated.query, pagination });

  return sendSuccess(res, {
    message: "Municipalities loaded",
    data: result.items,
    meta: result.meta,
  });
});

export const superAdminDashboard = asyncHandler(async (_req, res) => {
  const dashboard = await getSuperAdminDashboardData();

  return sendSuccess(res, {
    message: "Super admin dashboard loaded",
    data: dashboard,
  });
});

export const readMunicipality = asyncHandler(async (req, res) => {
  const result = await getMunicipalityWithAudit(req.params.id);

  return sendSuccess(res, {
    message: "Municipality loaded",
    data: result.municipality,
    meta: { auditLogs: result.auditLogs },
  });
});

export const addMunicipality = asyncHandler(async (req, res) => {
  const municipality = await createMunicipality({ req, payload: req.validated.body });

  return sendSuccess(res, {
    statusCode: 201,
    message: "Municipality created",
    data: municipality,
  });
});

export const editMunicipality = asyncHandler(async (req, res) => {
  const municipality = await updateMunicipality({
    req,
    id: req.params.id,
    payload: req.validated.body,
  });

  return sendSuccess(res, {
    message: "Municipality updated",
    data: municipality,
  });
});

export const browseAuditLogs = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.validated.query);
  const result = await listMunicipalityAuditLogs({ query: req.validated.query, pagination });

  return sendSuccess(res, {
    message: "Audit logs loaded",
    data: result.items,
    meta: result.meta,
  });
});

export const assignMunicipalAdminController = asyncHandler(async (req, res) => {
  const user = await assignMunicipalAdmin({
    req,
    municipalityId: req.params.id,
    payload: req.validated.body,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: "Municipal admin assigned",
    data: { user },
  });
});
