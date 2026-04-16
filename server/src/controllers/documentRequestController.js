import asyncHandler from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";
import { sendSuccess } from "../utils/apiResponse.js";
import {
  createCitizenDocumentRequest,
  getCitizenDocumentRequest,
  getManagedDocumentRequest,
  listCitizenDocumentRequests,
  listManagedDocumentRequests,
  trackCitizenDocumentRequest,
  updateManagedDocumentRequest,
} from "../services/documentRequestService.js";

export const browseCitizenDocumentRequests = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.validated.query);
  const result = await listCitizenDocumentRequests({ user: req.user, query: req.validated.query, pagination });

  return sendSuccess(res, {
    message: "Document requests loaded",
    data: result.items,
    meta: result.meta,
  });
});

export const readCitizenDocumentRequest = asyncHandler(async (req, res) => {
  const item = await getCitizenDocumentRequest({ user: req.user, id: req.params.id });

  return sendSuccess(res, {
    message: "Document request loaded",
    data: item,
  });
});

export const addCitizenDocumentRequest = asyncHandler(async (req, res) => {
  const item = await createCitizenDocumentRequest({ user: req.user, payload: req.validated.body });

  return sendSuccess(res, {
    statusCode: 201,
    message: "Document request submitted",
    data: item,
  });
});

export const trackCitizenRequest = asyncHandler(async (req, res) => {
  const item = await trackCitizenDocumentRequest({ user: req.user, trackingNumber: req.validated.params.trackingNumber });

  return sendSuccess(res, {
    message: "Request tracking loaded",
    data: item,
  });
});

export const browseManagedDocumentRequests = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.validated.query);
  const result = await listManagedDocumentRequests({ user: req.user, query: req.validated.query, pagination });

  return sendSuccess(res, {
    message: "Managed document requests loaded",
    data: result.items,
    meta: result.meta,
  });
});

export const readManagedDocumentRequest = asyncHandler(async (req, res) => {
  const item = await getManagedDocumentRequest({ user: req.user, id: req.params.id });

  return sendSuccess(res, {
    message: "Managed document request loaded",
    data: item,
  });
});

export const editManagedDocumentRequest = asyncHandler(async (req, res) => {
  const item = await updateManagedDocumentRequest({ req, user: req.user, id: req.params.id, payload: req.validated.body });

  return sendSuccess(res, {
    message: "Document request updated",
    data: item,
  });
});
