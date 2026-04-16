import User from "../models/User.js";
import { getCitizenDashboardData } from "../services/dashboardService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const readProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).lean();

  return sendSuccess(res, {
    message: "Profile loaded",
    data: { user },
  });
});

export const citizenDashboard = asyncHandler(async (req, res) => {
  const dashboard = await getCitizenDashboardData(req.user);

  return sendSuccess(res, {
    message: "Citizen dashboard loaded",
    data: dashboard,
  });
});
