import { getBarangayDashboardData } from "../services/dashboardService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const barangayDashboard = asyncHandler(async (req, res) => {
  const dashboard = await getBarangayDashboardData(req.user);

  return sendSuccess(res, {
    message: "Barangay dashboard loaded",
    data: dashboard,
  });
});
