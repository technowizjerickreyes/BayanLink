import asyncHandler from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";
import { sendSuccess } from "../utils/apiResponse.js";
import {
  createCitizenComplaint,
  getCitizenComplaint,
  listCitizenComplaints,
  listManagedComplaints,
  updateManagedComplaint,
} from "../services/complaintReportService.js";

export const browseCitizenComplaints = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.validated.query);
  const result = await listCitizenComplaints({ user: req.user, query: req.validated.query, pagination });

  return sendSuccess(res, {
    message: "Complaints loaded",
    data: result.items,
    meta: result.meta,
  });
});

export const readCitizenComplaint = asyncHandler(async (req, res) => {
  const item = await getCitizenComplaint({ user: req.user, id: req.params.id });

  return sendSuccess(res, {
    message: "Complaint loaded",
    data: item,
  });
});

export const addCitizenComplaint = asyncHandler(async (req, res) => {
  const item = await createCitizenComplaint({ user: req.user, payload: req.validated.body });

  return sendSuccess(res, {
    statusCode: 201,
    message: "Complaint submitted",
    data: item,
  });
});

export const browseManagedComplaints = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.validated.query);
  const result = await listManagedComplaints({ user: req.user, query: req.validated.query, pagination });

  return sendSuccess(res, {
    message: "Managed complaints loaded",
    data: result.items,
    meta: result.meta,
  });
});

export const editManagedComplaint = asyncHandler(async (req, res) => {
  const item = await updateManagedComplaint({ req, user: req.user, id: req.params.id, payload: req.validated.body });

  return sendSuccess(res, {
    message: "Complaint updated",
    data: item,
  });
});
