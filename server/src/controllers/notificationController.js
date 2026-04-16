import asyncHandler from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { listNotifications, markAllNotificationsRead, markNotificationRead } from "../services/notificationService.js";

export const browseNotifications = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.validated.query);
  const result = await listNotifications({
    user: req.user,
    pagination,
    unreadOnly: Boolean(req.validated.query.unreadOnly),
  });

  return sendSuccess(res, {
    message: "Notifications loaded",
    data: result.items,
    meta: result.meta,
  });
});

export const readNotification = asyncHandler(async (req, res) => {
  const item = await markNotificationRead({ user: req.user, id: req.params.id });

  return sendSuccess(res, {
    message: "Notification marked as read",
    data: item,
  });
});

export const readAllNotifications = asyncHandler(async (req, res) => {
  const count = await markAllNotificationsRead({ user: req.user });

  return sendSuccess(res, {
    message: "Notifications marked as read",
    data: { count },
  });
});
