import mongoose from "mongoose";
import ComplaintReport, { COMPLAINT_PRIORITIES, COMPLAINT_STATUSES } from "../models/ComplaintReport.js";
import ApiError from "../utils/ApiError.js";
import { getManagementScopeFilter } from "../utils/accessScope.js";
import { assertOnlyFields, pickFields } from "../utils/fieldWhitelist.js";
import { getPaginationMeta } from "../utils/pagination.js";
import { buildTrackingCandidate } from "../utils/trackingNumber.js";
import { COMPLAINT_CATEGORIES } from "../constants/phase1Catalog.js";
import { createAuditLog, safeAuditSubset } from "./auditService.js";
import { normalizeAttachments } from "./fileUploadService.js";
import { notifyScopedAdmins, notifyUser } from "./notificationService.js";

const COMPLAINT_CREATE_FIELDS = ["category", "title", "description", "attachments", "location"];
const COMPLAINT_UPDATE_FIELDS = ["status", "priority", "assignedOffice", "remarks"];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function complaintFilters(query = {}) {
  const filters = {};

  if (query.status) {
    filters.status = query.status;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.search) {
    const search = new RegExp(escapeRegExp(query.search), "i");
    filters.$or = [{ trackingNumber: search }, { title: search }, { description: search }, { assignedOffice: search }];
  }

  return filters;
}

function sanitizeLocation(location = {}, fallbackBarangayId = "") {
  if (!location || typeof location !== "object" || Array.isArray(location)) {
    throw new ApiError(400, "Location details are required");
  }

  assertOnlyFields(location, ["address", "barangayId", "landmark", "latitude", "longitude"]);

  if (!location.address || !String(location.address).trim()) {
    throw new ApiError(400, "Location address is required");
  }

  const barangayId = String(location.barangayId || fallbackBarangayId || "").trim();

  if (!barangayId) {
    throw new ApiError(400, "Location barangay is required");
  }

  return {
    address: String(location.address).trim(),
    barangayId,
    landmark: String(location.landmark || "").trim(),
    latitude: location.latitude === null || location.latitude === undefined || location.latitude === "" ? null : Number(location.latitude),
    longitude: location.longitude === null || location.longitude === undefined || location.longitude === "" ? null : Number(location.longitude),
  };
}

async function generateTrackingNumber() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const trackingNumber = buildTrackingCandidate("CMP");
    const exists = await ComplaintReport.exists({ trackingNumber });

    if (!exists) {
      return trackingNumber;
    }
  }

  throw new ApiError(500, "Unable to generate complaint tracking number");
}

function managedComplaintScope(user) {
  return getManagementScopeFilter(user);
}

function pushTimeline(item, { status, remarks = "", actor }) {
  item.timeline.push({
    status,
    remarks,
    actorUserId: actor?._id || null,
    actorRole: actor?.role || null,
    createdAt: new Date(),
  });
}

export async function listCitizenComplaints({ user, query, pagination }) {
  const filters = {
    citizenId: user._id,
    ...complaintFilters(query),
  };

  const [items, total] = await Promise.all([
    ComplaintReport.find(filters).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
    ComplaintReport.countDocuments(filters),
  ]);

  return {
    items,
    meta: getPaginationMeta({ ...pagination, total }),
  };
}

export async function listManagedComplaints({ user, query, pagination }) {
  const filters = {
    ...managedComplaintScope(user),
    ...complaintFilters(query),
  };

  const [items, total] = await Promise.all([
    ComplaintReport.find(filters)
      .populate("citizenId", "firstName lastName email barangayId")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    ComplaintReport.countDocuments(filters),
  ]);

  return {
    items,
    meta: getPaginationMeta({ ...pagination, total }),
  };
}

export async function getCitizenComplaint({ user, id }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid complaint id");
  }

  const item = await ComplaintReport.findOne({ _id: id, citizenId: user._id }).lean();

  if (!item) {
    throw new ApiError(404, "Complaint not found");
  }

  return item;
}

export async function createCitizenComplaint({ user, payload }) {
  if (user.role !== "citizen") {
    throw new ApiError(403, "Only citizens can submit complaints");
  }

  assertOnlyFields(payload, COMPLAINT_CREATE_FIELDS);

  if (!COMPLAINT_CATEGORIES.includes(payload.category)) {
    throw new ApiError(400, "Complaint category is invalid");
  }

  const trackingNumber = await generateTrackingNumber();
  const location = sanitizeLocation(payload.location, user.barangayId);
  const attachments = normalizeAttachments(payload.attachments || []);

  const item = await ComplaintReport.create({
    citizenId: user._id,
    municipalityId: user.municipalityId,
    barangayId: location.barangayId,
    category: payload.category,
    title: String(payload.title || "").trim(),
    description: String(payload.description || "").trim(),
    attachments,
    location,
    status: "submitted",
    priority: payload.category === "public_safety" ? "high" : "medium",
    trackingNumber,
    timeline: [
      {
        status: "submitted",
        remarks: "Complaint submitted online.",
        actorUserId: user._id,
        actorRole: user.role,
        createdAt: new Date(),
      },
    ],
  });

  await notifyScopedAdmins({
    municipalityId: user.municipalityId,
    barangayId: location.barangayId,
    includeBarangay: true,
    type: "complaint",
    title: "New complaint received",
    message: `${item.title} was submitted under ${item.category.replaceAll("_", " ")}.`,
    entityType: "complaint",
    entityId: item._id,
  });

  return item;
}

export async function updateManagedComplaint({ req, user, id, payload }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid complaint id");
  }

  assertOnlyFields(payload, COMPLAINT_UPDATE_FIELDS);
  const updates = pickFields(payload, COMPLAINT_UPDATE_FIELDS);

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "At least one field is required");
  }

  if (updates.status && !COMPLAINT_STATUSES.includes(updates.status)) {
    throw new ApiError(400, "Complaint status is invalid");
  }

  if (updates.priority && !COMPLAINT_PRIORITIES.includes(updates.priority)) {
    throw new ApiError(400, "Complaint priority is invalid");
  }

  const item = await ComplaintReport.findOne({ _id: id, ...managedComplaintScope(user) });

  if (!item) {
    throw new ApiError(404, "Complaint not found");
  }

  const oldValues = safeAuditSubset(item.toJSON(), COMPLAINT_UPDATE_FIELDS);

  if (updates.status) {
    item.status = updates.status;
  }

  if (updates.priority) {
    item.priority = updates.priority;
  }

  if (typeof updates.assignedOffice === "string") {
    item.assignedOffice = updates.assignedOffice.trim();
  }

  if (updates.status || updates.remarks) {
    pushTimeline(item, {
      status: updates.status || item.status,
      remarks: String(updates.remarks || "").trim(),
      actor: user,
    });
  }

  await item.save();

  await createAuditLog({
    req,
    actionType: "complaint_status_updated",
    targetType: "complaint",
    targetId: item._id,
    changedFields: Object.keys(updates),
    oldValues,
    newValues: safeAuditSubset(item.toJSON(), COMPLAINT_UPDATE_FIELDS),
  });

  await notifyUser({
    userId: item.citizenId,
    role: "citizen",
    municipalityId: item.municipalityId,
    barangayId: item.barangayId,
    type: "complaint",
    title: "Complaint updated",
    message: `${item.title} is now marked as ${item.status.replaceAll("_", " ")}.`,
    entityType: "complaint",
    entityId: item._id,
  });

  return item;
}

export async function countComplaintsForDashboard(user) {
  if (user.role === "citizen") {
    const [open, resolved] = await Promise.all([
      ComplaintReport.countDocuments({ citizenId: user._id, status: { $in: ["submitted", "under_review", "in_progress"] } }),
      ComplaintReport.countDocuments({ citizenId: user._id, status: { $in: ["resolved", "closed"] } }),
    ]);
    return { open, resolved };
  }

  const scope = managedComplaintScope(user);
  const [open, resolved] = await Promise.all([
    ComplaintReport.countDocuments({ ...scope, status: { $in: ["submitted", "under_review", "in_progress"] } }),
    ComplaintReport.countDocuments({ ...scope, status: { $in: ["resolved", "closed"] } }),
  ]);

  return { open, resolved };
}
