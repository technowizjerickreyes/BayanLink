import asyncHandler from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";
import { sendSuccess } from "../utils/apiResponse.js";
import {
  archiveManagedNews,
  createManagedNews,
  getNewsForViewer,
  listManagedNews,
  listVisibleNews,
  updateManagedNews,
} from "../services/newsFeedService.js";

export const browseVisibleNewsFeeds = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.validated.query);
  const result = await listVisibleNews({ user: req.user, query: req.validated.query, pagination });

  return sendSuccess(res, {
    message: "News feed loaded",
    data: result.items,
    meta: result.meta,
  });
});

export const readVisibleNewsFeed = asyncHandler(async (req, res) => {
  const item = await getNewsForViewer({ user: req.user, id: req.params.id });

  return sendSuccess(res, {
    message: "News post loaded",
    data: item,
  });
});

export const browseManagedNewsFeeds = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.validated.query);
  const result = await listManagedNews({ user: req.user, query: req.validated.query, pagination });

  return sendSuccess(res, {
    message: "Managed news posts loaded",
    data: result.items,
    meta: result.meta,
  });
});

export const readManagedNewsFeed = asyncHandler(async (req, res) => {
  const item = await getNewsForViewer({ user: req.user, id: req.params.id, managed: true });

  return sendSuccess(res, {
    message: "News post loaded",
    data: item,
  });
});

export const addManagedNewsFeed = asyncHandler(async (req, res) => {
  const item = await createManagedNews({ user: req.user, payload: req.validated.body });

  return sendSuccess(res, {
    statusCode: 201,
    message: "News post created",
    data: item,
  });
});

export const editManagedNewsFeed = asyncHandler(async (req, res) => {
  const item = await updateManagedNews({ user: req.user, id: req.params.id, payload: req.validated.body });

  return sendSuccess(res, {
    message: "News post updated",
    data: item,
  });
});

export const archiveManagedNewsFeed = asyncHandler(async (req, res) => {
  const item = await archiveManagedNews({ user: req.user, id: req.params.id });

  return sendSuccess(res, {
    message: "News post archived",
    data: item,
  });
});
