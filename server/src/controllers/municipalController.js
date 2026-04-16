import Municipality from "../models/Municipality.js";
import { getMunicipalDashboardData } from "../services/dashboardService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const municipalDashboard = asyncHandler(async (req, res) => {
  const dashboard = await getMunicipalDashboardData(req.user);

  return sendSuccess(res, {
    message: "Municipal dashboard loaded",
    data: dashboard,
  });
});

export const readCurrentMunicipality = asyncHandler(async (req, res) => {
  const municipality = await Municipality.findOne({ _id: req.user.municipalityId, deletedAt: null }).lean();

  return sendSuccess(res, {
    message: "Current municipality loaded",
    data: municipality,
  });
});
