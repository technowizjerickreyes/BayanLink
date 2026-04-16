import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { getPaginationMeta } from "../utils/pagination.js";

function uniqueUsers(users = []) {
  const seen = new Set();
  return users.filter((user) => {
    const key = String(user._id || user.userId || "");

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function linkFor(role, entityType, entityId) {
  if (!entityId) {
    return "/dashboard";
  }

  if (role === "citizen") {
    if (entityType === "document_request") return `/citizen/document-requests/${entityId}`;
    if (entityType === "appointment") return "/citizen/appointments";
    if (entityType === "complaint") return `/citizen/complaints/${entityId}`;
  }

  if (role === "municipal_admin") {
    if (entityType === "document_request") return "/municipal/document-requests";
    if (entityType === "appointment") return "/municipal/appointments";
    if (entityType === "complaint") return "/municipal/complaints";
  }

  if (role === "barangay_admin") {
    if (entityType === "document_request") return "/barangay/document-requests";
    if (entityType === "appointment") return "/barangay/appointments";
    if (entityType === "complaint") return "/barangay/complaints";
  }

  return "/dashboard";
}

async function createNotificationsForUsers({ users = [], type, title, message, entityType, entityId, municipalityId = null, barangayId = "" }) {
  const recipients = uniqueUsers(users);

  if (recipients.length === 0) {
    return [];
  }

  return Notification.insertMany(
    recipients.map((user) => ({
      userId: user._id,
      role: user.role,
      municipalityId: municipalityId || user.municipalityId || null,
      barangayId: barangayId || user.barangayId || "",
      type,
      title,
      message,
      link: linkFor(user.role, entityType, entityId),
      entityType,
      entityId,
    }))
  );
}

async function findScopedAdmins({ municipalityId, barangayId = "", includeBarangay = true }) {
  const filters = [
    {
      role: "municipal_admin",
      municipalityId,
      status: "active",
    },
  ];

  if (includeBarangay && barangayId) {
    filters.push({
      role: "barangay_admin",
      municipalityId,
      barangayId,
      status: "active",
    });
  }

  return User.find({ $or: filters }).select("_id role municipalityId barangayId").lean();
}

export async function notifyScopedAdmins({ municipalityId, barangayId = "", includeBarangay = true, type, title, message, entityType, entityId }) {
  const users = await findScopedAdmins({ municipalityId, barangayId, includeBarangay });
  return createNotificationsForUsers({ users, municipalityId, barangayId, type, title, message, entityType, entityId });
}

export async function notifyUser({ userId, role, municipalityId = null, barangayId = "", type, title, message, entityType, entityId }) {
  if (!userId || !role) {
    return null;
  }

  const users = [{ _id: userId, role, municipalityId, barangayId }];
  const [notification] = await createNotificationsForUsers({ users, municipalityId, barangayId, type, title, message, entityType, entityId });
  return notification || null;
}

export async function listNotifications({ user, pagination, unreadOnly = false }) {
  const filters = { userId: user._id };

  if (unreadOnly) {
    filters.readAt = null;
  }

  const [items, total, unreadCount] = await Promise.all([
    Notification.find(filters).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
    Notification.countDocuments(filters),
    Notification.countDocuments({ userId: user._id, readAt: null }),
  ]);

  return {
    items,
    meta: {
      ...getPaginationMeta({ ...pagination, total }),
      unreadCount,
    },
  };
}

export async function markNotificationRead({ user, id }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid notification id");
  }

  const existing = await Notification.findOne({ _id: id, userId: user._id });

  if (!existing) {
    throw new ApiError(404, "Notification not found");
  }

  if (!existing.readAt) {
    existing.readAt = new Date();
    await existing.save();
  }

  return existing;
}

export async function markAllNotificationsRead({ user }) {
  const result = await Notification.updateMany({ userId: user._id, readAt: null }, { $set: { readAt: new Date() } });
  return result.modifiedCount || 0;
}
