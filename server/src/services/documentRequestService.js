import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import DocumentRequest, { DOCUMENT_PAYMENT_STATUSES, DOCUMENT_REQUEST_STATUSES } from "../models/DocumentRequest.js";
import DocumentRequestTimeline from "../models/DocumentRequestTimeline.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { getManagementScopeFilter } from "../utils/accessScope.js";
import { assertOnlyFields, pickFields } from "../utils/fieldWhitelist.js";
import { getPaginationMeta } from "../utils/pagination.js";
import { buildTrackingCandidate } from "../utils/trackingNumber.js";
import { DOCUMENT_REQUEST_TYPES, DOCUMENT_REQUEST_TYPE_VALUES } from "../constants/phase1Catalog.js";
import { createAuditLog, safeAuditSubset } from "./auditService.js";
import { normalizeAttachments } from "./fileUploadService.js";
import { notifyScopedAdmins, notifyUser } from "./notificationService.js";

const DOCUMENT_REQUEST_MUTABLE_FIELDS = ["status", "remarks", "assignedTo", "paymentStatus", "appointmentId", "pickupSchedule"];
const DOCUMENT_SUBMITTED_DATA_FIELDS = ["fullName", "birthDate", "civilStatus", "purpose", "deliveryPreference", "notes"];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function requestDefinition(requestType) {
  return DOCUMENT_REQUEST_TYPES.find((item) => item.value === requestType) || null;
}

function sanitizeSubmittedData(submittedData = {}) {
  if (!submittedData || typeof submittedData !== "object" || Array.isArray(submittedData)) {
    throw new ApiError(400, "Submitted data must be an object");
  }

  assertOnlyFields(submittedData, DOCUMENT_SUBMITTED_DATA_FIELDS, "Submitted data contains unsupported fields");

  const clean = pickFields(submittedData, DOCUMENT_SUBMITTED_DATA_FIELDS);

  if (!clean.fullName || !String(clean.fullName).trim()) {
    throw new ApiError(400, "Full name is required");
  }

  if (!clean.purpose || !String(clean.purpose).trim()) {
    throw new ApiError(400, "Purpose is required");
  }

  return Object.entries(clean).reduce((payload, [key, value]) => {
    payload[key] = typeof value === "string" ? value.trim() : value;
    return payload;
  }, {});
}

async function generateTrackingNumber() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const trackingNumber = buildTrackingCandidate("DOC");
    const exists = await DocumentRequest.exists({ trackingNumber });

    if (!exists) {
      return trackingNumber;
    }
  }

  throw new ApiError(500, "Unable to generate tracking number");
}

async function appendTimelineEntry({ requestId, actor, fromStatus = null, toStatus, remarks = "", visibility = "public" }) {
  return DocumentRequestTimeline.create({
    requestId,
    actorUserId: actor?._id || null,
    actorRole: actor?.role || null,
    fromStatus,
    toStatus,
    remarks,
    visibility,
  });
}

function decorateRequest(item, timeline = []) {
  const request = typeof item.toJSON === "function" ? item.toJSON() : { ...item };

  let nextAction = "Await a status update from the LGU.";

  if (request.status === "approved") {
    nextAction = "Wait for the release schedule or proceed to appointment booking if instructed.";
  } else if (request.status === "for_pickup") {
    nextAction = request.pickupSchedule
      ? `Claim the document on ${new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(request.pickupSchedule))}.`
      : "Prepare for document pickup and monitor LGU instructions.";
  } else if (request.status === "rejected") {
    nextAction = "Review the remarks, complete the missing requirements, and submit a new request if needed.";
  } else if (request.status === "completed") {
    nextAction = "No further action is required. The request is complete.";
  } else if (request.status === "cancelled") {
    nextAction = "This request was cancelled and can no longer be processed.";
  }

  return {
    ...request,
    nextAction,
    timeline,
  };
}

function requestSearchFilters(query = {}) {
  const filters = {};

  if (query.status) {
    filters.status = query.status;
  }

  if (query.requestType) {
    filters.requestType = query.requestType;
  }

  if (query.paymentStatus) {
    filters.paymentStatus = query.paymentStatus;
  }

  if (query.search) {
    const search = new RegExp(escapeRegExp(query.search), "i");
    filters.$or = [{ trackingNumber: search }, { serviceName: search }, { remarks: search }, { "submittedData.purpose": search }];
  }

  return filters;
}

function managedRequestScope(user) {
  const filters = getManagementScopeFilter(user);

  if (user.role === "barangay_admin") {
    filters.scope = "barangay";
  }

  return filters;
}

async function validateAssignedUser(actor, assignedTo) {
  if (!assignedTo) {
    return null;
  }

  const scopeFilters = actor.role === "barangay_admin"
    ? { role: "barangay_admin", municipalityId: actor.municipalityId, barangayId: actor.barangayId, status: "active" }
    : { role: { $in: ["municipal_admin", "barangay_admin"] }, municipalityId: actor.municipalityId, status: "active" };

  const user = await User.findOne({ _id: assignedTo, ...scopeFilters }).lean();

  if (!user) {
    throw new ApiError(400, "Assigned staff user is invalid for this scope");
  }

  return user;
}

async function validateLinkedAppointment({ appointmentId, request, citizenId }) {
  if (!appointmentId) {
    return null;
  }

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    citizenId,
    municipalityId: request?.municipalityId || undefined,
  }).lean();

  if (!appointment) {
    throw new ApiError(400, "Appointment is invalid for this request");
  }

  return appointment;
}

function ensureObjectId(id, label) {
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `${label} is invalid`);
  }
}

export async function listCitizenDocumentRequests({ user, query, pagination }) {
  const filters = {
    citizenId: user._id,
    ...requestSearchFilters(query),
  };

  const [items, total] = await Promise.all([
    DocumentRequest.find(filters)
      .populate("assignedTo", "firstName lastName role")
      .populate("appointmentId", "date timeSlot status serviceName")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    DocumentRequest.countDocuments(filters),
  ]);

  return {
    items: items.map((item) => decorateRequest(item)),
    meta: getPaginationMeta({ ...pagination, total }),
  };
}

export async function listManagedDocumentRequests({ user, query, pagination }) {
  const filters = {
    ...managedRequestScope(user),
    ...requestSearchFilters(query),
  };

  const [items, total] = await Promise.all([
    DocumentRequest.find(filters)
      .populate("citizenId", "firstName lastName email barangayId")
      .populate("assignedTo", "firstName lastName role")
      .populate("appointmentId", "date timeSlot status serviceName")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    DocumentRequest.countDocuments(filters),
  ]);

  return {
    items: items.map((item) => decorateRequest(item)),
    meta: getPaginationMeta({ ...pagination, total }),
  };
}

export async function getCitizenDocumentRequest({ user, id }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid document request id");
  }

  const item = await DocumentRequest.findOne({ _id: id, citizenId: user._id })
    .populate("assignedTo", "firstName lastName role")
    .populate("appointmentId", "date timeSlot status serviceName")
    .lean();

  if (!item) {
    throw new ApiError(404, "Document request not found");
  }

  const timeline = await DocumentRequestTimeline.find({ requestId: item._id, visibility: "public" })
    .populate("actorUserId", "firstName lastName email role")
    .sort({ createdAt: 1 })
    .lean();
  return decorateRequest(item, timeline);
}

export async function getManagedDocumentRequest({ user, id }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid document request id");
  }

  const item = await DocumentRequest.findOne({ _id: id, ...managedRequestScope(user) })
    .populate("citizenId", "firstName lastName email barangayId phone")
    .populate("assignedTo", "firstName lastName role")
    .populate("appointmentId", "date timeSlot status serviceName")
    .lean();

  if (!item) {
    throw new ApiError(404, "Document request not found");
  }

  const timeline = await DocumentRequestTimeline.find({ requestId: item._id })
    .populate("actorUserId", "firstName lastName email role")
    .sort({ createdAt: 1 })
    .lean();
  return decorateRequest(item, timeline);
}

export async function trackCitizenDocumentRequest({ user, trackingNumber }) {
  const item = await DocumentRequest.findOne({
    citizenId: user._id,
    trackingNumber: String(trackingNumber || "").toUpperCase(),
  })
    .populate("appointmentId", "date timeSlot status serviceName")
    .lean();

  if (!item) {
    throw new ApiError(404, "Tracking number not found");
  }

  const timeline = await DocumentRequestTimeline.find({ requestId: item._id, visibility: "public" })
    .populate("actorUserId", "firstName lastName email role")
    .sort({ createdAt: 1 })
    .lean();
  return decorateRequest(item, timeline);
}

export async function createCitizenDocumentRequest({ user, payload }) {
  if (user.role !== "citizen") {
    throw new ApiError(403, "Only citizens can submit document requests");
  }

  assertOnlyFields(payload, ["requestType", "submittedData", "attachments", "appointmentId"]);

  if (!DOCUMENT_REQUEST_TYPE_VALUES.includes(payload.requestType)) {
    throw new ApiError(400, "Request type is invalid");
  }

  const definition = requestDefinition(payload.requestType);
  const trackingNumber = await generateTrackingNumber();
  const submittedData = sanitizeSubmittedData(payload.submittedData);
  const attachments = normalizeAttachments(payload.attachments || []);

  ensureObjectId(payload.appointmentId, "Appointment id");

  const appointment = payload.appointmentId
    ? await Appointment.findOne({ _id: payload.appointmentId, citizenId: user._id, municipalityId: user.municipalityId }).lean()
    : null;

  if (payload.appointmentId && !appointment) {
    throw new ApiError(400, "Appointment is invalid for this request");
  }

  const item = await DocumentRequest.create({
    scope: definition.scope,
    requestType: definition.value,
    serviceName: definition.label,
    citizenId: user._id,
    municipalityId: user.municipalityId,
    barangayId: user.barangayId,
    submittedData,
    attachments,
    trackingNumber,
    status: "pending",
    paymentStatus: "not_applicable",
    appointmentId: appointment?._id || null,
  });

  await appendTimelineEntry({
    requestId: item._id,
    actor: user,
    toStatus: "pending",
    remarks: "Request submitted online.",
  });

  await notifyScopedAdmins({
    municipalityId: user.municipalityId,
    barangayId: user.barangayId,
    includeBarangay: definition.scope === "barangay",
    type: "document_request",
    title: "New document request received",
    message: `${definition.label} was submitted with tracking number ${trackingNumber}.`,
    entityType: "document_request",
    entityId: item._id,
  });

  return getCitizenDocumentRequest({ user, id: item._id });
}

export async function updateManagedDocumentRequest({ req, user, id, payload }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid document request id");
  }

  assertOnlyFields(payload, DOCUMENT_REQUEST_MUTABLE_FIELDS);
  const updates = pickFields(payload, DOCUMENT_REQUEST_MUTABLE_FIELDS);

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "At least one field is required");
  }

  if (updates.status && !DOCUMENT_REQUEST_STATUSES.includes(updates.status)) {
    throw new ApiError(400, "Document request status is invalid");
  }

  if (updates.paymentStatus && !DOCUMENT_PAYMENT_STATUSES.includes(updates.paymentStatus)) {
    throw new ApiError(400, "Payment status is invalid");
  }

  ensureObjectId(updates.assignedTo, "Assigned user id");
  ensureObjectId(updates.appointmentId, "Appointment id");

  const item = await DocumentRequest.findOne({ _id: id, ...managedRequestScope(user) });

  if (!item) {
    throw new ApiError(404, "Document request not found");
  }

  const oldValues = safeAuditSubset(item.toJSON(), DOCUMENT_REQUEST_MUTABLE_FIELDS);
  const previousStatus = item.status;

  if (updates.assignedTo) {
    await validateAssignedUser(user, updates.assignedTo);
  }

  if (updates.appointmentId) {
    await validateLinkedAppointment({ appointmentId: updates.appointmentId, request: item, citizenId: item.citizenId });
  }

  if (updates.pickupSchedule) {
    const pickupDate = new Date(updates.pickupSchedule);

    if (Number.isNaN(pickupDate.getTime())) {
      throw new ApiError(400, "Pickup schedule is invalid");
    }

    updates.pickupSchedule = pickupDate;
  }

  Object.assign(item, updates);
  item.reviewedAt = new Date();

  if (!item.assignedTo) {
    item.assignedTo = user._id;
  }

  await item.save();

  if (updates.appointmentId) {
    await Appointment.updateOne({ _id: updates.appointmentId }, { $set: { linkedRequestId: item._id } });
  }

  const timelineRemarks = typeof updates.remarks === "string" ? updates.remarks : "";

  if (updates.status || timelineRemarks) {
    await appendTimelineEntry({
      requestId: item._id,
      actor: user,
      fromStatus: previousStatus,
      toStatus: updates.status || item.status,
      remarks: timelineRemarks,
    });
  }

  await createAuditLog({
    req,
    actionType: "document_request_status_updated",
    targetType: "document_request",
    targetId: item._id,
    changedFields: Object.keys(updates),
    oldValues,
    newValues: safeAuditSubset(item.toJSON(), DOCUMENT_REQUEST_MUTABLE_FIELDS),
  });

  await notifyUser({
    userId: item.citizenId,
    role: "citizen",
    municipalityId: item.municipalityId,
    barangayId: item.barangayId,
    type: "document_request",
    title: "Document request updated",
    message: `${item.serviceName} is now marked as ${item.status.replaceAll("_", " ")}.`,
    entityType: "document_request",
    entityId: item._id,
  });

  return getManagedDocumentRequest({ user, id: item._id });
}

export async function countDocumentRequestsForDashboard(user) {
  if (user.role === "citizen") {
    const [active, completed] = await Promise.all([
      DocumentRequest.countDocuments({ citizenId: user._id, status: { $in: ["pending", "under_review", "approved", "for_pickup"] } }),
      DocumentRequest.countDocuments({ citizenId: user._id, status: "completed" }),
    ]);
    return { active, completed };
  }

  const scope = managedRequestScope(user);
  const [pending, completed] = await Promise.all([
    DocumentRequest.countDocuments({ ...scope, status: { $in: ["pending", "under_review", "approved", "for_pickup"] } }),
    DocumentRequest.countDocuments({ ...scope, status: "completed" }),
  ]);

  return { pending, completed };
}
