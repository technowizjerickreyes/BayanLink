import mongoose from "mongoose";
import Appointment, { APPOINTMENT_STATUSES } from "../models/Appointment.js";
import DocumentRequest from "../models/DocumentRequest.js";
import ApiError from "../utils/ApiError.js";
import { getManagementScopeFilter } from "../utils/accessScope.js";
import { assertOnlyFields, pickFields } from "../utils/fieldWhitelist.js";
import { getPaginationMeta } from "../utils/pagination.js";
import { APPOINTMENT_SERVICES, APPOINTMENT_SERVICE_VALUES } from "../constants/phase1Catalog.js";
import { createAuditLog, safeAuditSubset } from "./auditService.js";
import { notifyScopedAdmins, notifyUser } from "./notificationService.js";

const APPOINTMENT_CREATE_FIELDS = ["serviceId", "date", "timeSlot", "endTimeSlot", "purpose", "notes", "linkedRequestId"];
const APPOINTMENT_CITIZEN_UPDATE_FIELDS = ["date", "timeSlot", "endTimeSlot", "purpose", "notes", "status"];
const APPOINTMENT_MANAGER_UPDATE_FIELDS = ["status", "notes", "date", "timeSlot", "endTimeSlot"];
const ACTIVE_APPOINTMENT_STATUSES = ["pending", "confirmed"];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function appointmentDefinition(serviceId) {
  return APPOINTMENT_SERVICES.find((item) => item.value === serviceId) || null;
}

function normalizeDateOnly(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ApiError(400, "Appointment date is invalid");
  }

  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function appointmentStart(date, timeSlot) {
  const [hours, minutes] = String(timeSlot || "00:00")
    .split(":")
    .map((value) => Number.parseInt(value, 10));
  const start = new Date(date);
  start.setUTCHours(hours, minutes, 0, 0);
  return start;
}

function ensureFutureBooking(date, timeSlot) {
  const start = appointmentStart(date, timeSlot);

  if (start <= new Date()) {
    throw new ApiError(400, "Appointment must be booked in the future");
  }
}

function ensureCitizenCanModify(appointment) {
  const hoursUntilAppointment = (appointmentStart(appointment.date, appointment.timeSlot).getTime() - Date.now()) / (1000 * 60 * 60);

  if (hoursUntilAppointment < 12) {
    throw new ApiError(400, "Appointments can only be changed at least 12 hours before the schedule");
  }
}

function appointmentFilters(query = {}) {
  const filters = {};

  if (query.status) {
    filters.status = query.status;
  }

  if (query.serviceId) {
    filters.serviceId = query.serviceId;
  }

  if (query.dateFrom || query.dateTo) {
    filters.date = {};
    if (query.dateFrom) filters.date.$gte = normalizeDateOnly(query.dateFrom);
    if (query.dateTo) filters.date.$lte = normalizeDateOnly(query.dateTo);
  }

  if (query.search) {
    const search = new RegExp(escapeRegExp(query.search), "i");
    filters.$or = [{ serviceName: search }, { purpose: search }, { notes: search }];
  }

  return filters;
}

function managedAppointmentScope(user) {
  const scope = getManagementScopeFilter(user);

  if (user.role === "barangay_admin") {
    scope.scope = "barangay";
  }

  return scope;
}

function resolveBarangayScope({ user, scope, barangayId = "" }) {
  if (scope !== "barangay") {
    return "";
  }

  if (user.role === "citizen" || user.role === "barangay_admin") {
    return user.barangayId;
  }

  if (user.role === "municipal_admin") {
    if (!barangayId) {
      throw new ApiError(400, "Select a barangay appointment first to review service-desk availability");
    }

    return barangayId;
  }

  throw new ApiError(403, "You do not have permission to review appointment availability");
}

async function ensureOpenSlot({ municipalityId, barangayId, scope, date, timeSlot, excludeId = null }) {
  const filters = {
    municipalityId,
    barangayId: scope === "barangay" ? barangayId : "",
    scope,
    date,
    timeSlot,
    status: { $in: ACTIVE_APPOINTMENT_STATUSES },
  };

  if (excludeId) {
    filters._id = { $ne: excludeId };
  }

  const existing = await Appointment.findOne(filters).lean();

  if (existing) {
    throw new ApiError(409, "The selected time slot is already booked");
  }
}

function buildHistoryEntry({ status, remarks = "", actor }) {
  return {
    status,
    remarks,
    changedByUserId: actor?._id || null,
    changedByRole: actor?.role || null,
    changedAt: new Date(),
  };
}

async function validateLinkedRequest({ linkedRequestId, user, municipalityId }) {
  if (!linkedRequestId) {
    return null;
  }

  const request = await DocumentRequest.findOne({
    _id: linkedRequestId,
    citizenId: user._id,
    municipalityId,
  }).lean();

  if (!request) {
    throw new ApiError(400, "Linked request is invalid");
  }

  return request;
}

async function findCitizenAppointment(filters) {
  return Appointment.findOne(filters).populate("linkedRequestId", "trackingNumber serviceName status").lean();
}

async function findManagedAppointment(filters) {
  return Appointment.findOne(filters)
    .populate("citizenId", "firstName lastName email barangayId")
    .populate("linkedRequestId", "trackingNumber serviceName status")
    .lean();
}

export async function listCitizenAppointments({ user, query, pagination }) {
  const filters = {
    citizenId: user._id,
    ...appointmentFilters(query),
  };

  const [items, total] = await Promise.all([
    Appointment.find(filters).populate("linkedRequestId", "trackingNumber serviceName status").sort({ date: -1, createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
    Appointment.countDocuments(filters),
  ]);

  return {
    items,
    meta: getPaginationMeta({ ...pagination, total }),
  };
}

export async function getCitizenAppointment({ user, id }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid appointment id");
  }

  const item = await findCitizenAppointment({ _id: id, citizenId: user._id });

  if (!item) {
    throw new ApiError(404, "Appointment not found");
  }

  return item;
}

export async function listManagedAppointments({ user, query, pagination }) {
  const filters = {
    ...managedAppointmentScope(user),
    ...appointmentFilters(query),
  };

  const [items, total] = await Promise.all([
    Appointment.find(filters)
      .populate("citizenId", "firstName lastName email barangayId")
      .populate("linkedRequestId", "trackingNumber serviceName status")
      .sort({ date: -1, createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Appointment.countDocuments(filters),
  ]);

  return {
    items,
    meta: getPaginationMeta({ ...pagination, total }),
  };
}

export async function getManagedAppointment({ user, id }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid appointment id");
  }

  const item = await findManagedAppointment({ _id: id, ...managedAppointmentScope(user) });

  if (!item) {
    throw new ApiError(404, "Appointment not found");
  }

  return item;
}

export async function getAppointmentAvailability({ user, query }) {
  const definition = appointmentDefinition(query.serviceId);

  if (!definition) {
    throw new ApiError(400, "Service is invalid");
  }

  const date = normalizeDateOnly(query.date);
  const barangayId = resolveBarangayScope({ user, scope: definition.scope, barangayId: query.barangayId });
  const filters = {
    municipalityId: user.municipalityId,
    barangayId: definition.scope === "barangay" ? barangayId : "",
    scope: definition.scope,
    date,
    status: { $in: ACTIVE_APPOINTMENT_STATUSES },
  };

  if (query.excludeId) {
    filters._id = { $ne: query.excludeId };
  }

  let finder = Appointment.find(filters)
    .select("timeSlot endTimeSlot serviceId serviceName status citizenId purpose linkedRequestId barangayId")
    .sort({ timeSlot: 1, createdAt: 1 });

  if (user.role !== "citizen") {
    finder = finder.populate("citizenId", "firstName lastName email barangayId");
  }

  const bookedItems = await finder.lean();

  return {
    service: {
      value: definition.value,
      label: definition.label,
      scope: definition.scope,
    },
    date,
    barangayId,
    bookedCount: bookedItems.length,
    bookedItems,
    bookedTimeSlots: bookedItems.map((item) => item.timeSlot),
  };
}

export async function createCitizenAppointment({ user, payload }) {
  if (user.role !== "citizen") {
    throw new ApiError(403, "Only citizens can create appointments");
  }

  assertOnlyFields(payload, APPOINTMENT_CREATE_FIELDS);

  if (!APPOINTMENT_SERVICE_VALUES.includes(payload.serviceId)) {
    throw new ApiError(400, "Service is invalid");
  }

  if (payload.linkedRequestId && !mongoose.Types.ObjectId.isValid(payload.linkedRequestId)) {
    throw new ApiError(400, "Linked request id is invalid");
  }

  const definition = appointmentDefinition(payload.serviceId);
  const date = normalizeDateOnly(payload.date);

  ensureFutureBooking(date, payload.timeSlot);
  await ensureOpenSlot({
    municipalityId: user.municipalityId,
    barangayId: user.barangayId,
    scope: definition.scope,
    date,
    timeSlot: payload.timeSlot,
  });

  const linkedRequest = await validateLinkedRequest({ linkedRequestId: payload.linkedRequestId, user, municipalityId: user.municipalityId });

  const item = await Appointment.create({
    citizenId: user._id,
    serviceId: definition.value,
    serviceName: definition.label,
    municipalityId: user.municipalityId,
    barangayId: definition.scope === "barangay" ? user.barangayId : "",
    scope: definition.scope,
    date,
    timeSlot: payload.timeSlot,
    endTimeSlot: payload.endTimeSlot || "",
    purpose: String(payload.purpose || "").trim(),
    notes: String(payload.notes || "").trim(),
    linkedRequestId: linkedRequest?._id || null,
    status: "pending",
    createdByRole: "citizen",
    history: [buildHistoryEntry({ status: "pending", remarks: "Appointment requested online.", actor: user })],
  });

  if (linkedRequest) {
    await DocumentRequest.updateOne({ _id: linkedRequest._id }, { $set: { appointmentId: item._id } });
  }

  await notifyScopedAdmins({
    municipalityId: user.municipalityId,
    barangayId: user.barangayId,
    includeBarangay: definition.scope === "barangay",
    type: "appointment",
    title: "New appointment requested",
    message: `${definition.label} has been booked for ${payload.timeSlot} on ${payload.date}.`,
    entityType: "appointment",
    entityId: item._id,
  });

  return item;
}

export async function updateCitizenAppointment({ user, id, payload }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid appointment id");
  }

  assertOnlyFields(payload, APPOINTMENT_CITIZEN_UPDATE_FIELDS);
  const updates = pickFields(payload, APPOINTMENT_CITIZEN_UPDATE_FIELDS);

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "At least one field is required");
  }

  const item = await Appointment.findOne({ _id: id, citizenId: user._id });

  if (!item) {
    throw new ApiError(404, "Appointment not found");
  }

  if (!["pending", "confirmed"].includes(item.status)) {
    throw new ApiError(400, "Only pending or confirmed appointments can be changed");
  }

  ensureCitizenCanModify(item);

  if (updates.status === "cancelled") {
    item.status = "cancelled";
    item.notes = typeof updates.notes === "string" ? updates.notes.trim() : item.notes;
    item.history.push(buildHistoryEntry({ status: "cancelled", remarks: "Citizen cancelled the appointment.", actor: user }));
    await item.save();

    await notifyScopedAdmins({
      municipalityId: item.municipalityId,
      barangayId: item.barangayId,
      includeBarangay: item.scope === "barangay",
      type: "appointment",
      title: "Appointment cancelled",
      message: `${item.serviceName} was cancelled by the citizen.`,
      entityType: "appointment",
      entityId: item._id,
    });

    return item;
  }

  const nextDate = updates.date ? normalizeDateOnly(updates.date) : item.date;
  const nextTimeSlot = updates.timeSlot || item.timeSlot;

  ensureFutureBooking(nextDate, nextTimeSlot);
  await ensureOpenSlot({
    municipalityId: item.municipalityId,
    barangayId: item.barangayId,
    scope: item.scope,
    date: nextDate,
    timeSlot: nextTimeSlot,
    excludeId: item._id,
  });

  item.date = nextDate;
  item.timeSlot = nextTimeSlot;
  item.endTimeSlot = typeof updates.endTimeSlot === "string" ? updates.endTimeSlot : item.endTimeSlot;
  item.purpose = typeof updates.purpose === "string" ? updates.purpose.trim() : item.purpose;
  item.notes = typeof updates.notes === "string" ? updates.notes.trim() : item.notes;
  item.status = "pending";
  item.history.push(buildHistoryEntry({ status: "pending", remarks: "Citizen requested a schedule change.", actor: user }));
  await item.save();

  await notifyScopedAdmins({
    municipalityId: item.municipalityId,
    barangayId: item.barangayId,
    includeBarangay: item.scope === "barangay",
    type: "appointment",
    title: "Appointment rescheduled",
    message: `${item.serviceName} has a new requested schedule.`,
    entityType: "appointment",
    entityId: item._id,
  });

  return item;
}

export async function updateManagedAppointment({ req, user, id, payload }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid appointment id");
  }

  assertOnlyFields(payload, APPOINTMENT_MANAGER_UPDATE_FIELDS);
  const updates = pickFields(payload, APPOINTMENT_MANAGER_UPDATE_FIELDS);

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "At least one field is required");
  }

  if (updates.status && !APPOINTMENT_STATUSES.includes(updates.status)) {
    throw new ApiError(400, "Appointment status is invalid");
  }

  const item = await Appointment.findOne({ _id: id, ...managedAppointmentScope(user) });

  if (!item) {
    throw new ApiError(404, "Appointment not found");
  }

  const oldValues = safeAuditSubset(item.toJSON(), APPOINTMENT_MANAGER_UPDATE_FIELDS);
  const hasScheduleChange = Boolean(updates.date || updates.timeSlot || typeof updates.endTimeSlot === "string");

  if (typeof updates.notes === "string") {
    item.notes = updates.notes.trim();
  }

  if (hasScheduleChange) {
    const nextDate = updates.date ? normalizeDateOnly(updates.date) : item.date;
    const nextTimeSlot = updates.timeSlot || item.timeSlot;

    ensureFutureBooking(nextDate, nextTimeSlot);
    await ensureOpenSlot({
      municipalityId: item.municipalityId,
      barangayId: item.barangayId,
      scope: item.scope,
      date: nextDate,
      timeSlot: nextTimeSlot,
      excludeId: item._id,
    });

    item.date = nextDate;
    item.timeSlot = nextTimeSlot;
    item.endTimeSlot = typeof updates.endTimeSlot === "string" ? updates.endTimeSlot : item.endTimeSlot;
  }

  if (updates.status) {
    item.status = updates.status;
  }

  if (updates.status || hasScheduleChange) {
    const historyStatus = updates.status || item.status;
    const defaultRemarks = hasScheduleChange
      ? updates.status
        ? `Schedule updated and status changed to ${historyStatus}.`
        : "Schedule updated by the service desk."
      : `Status changed to ${historyStatus}.`;

    item.history.push(
      buildHistoryEntry({
        status: historyStatus,
        remarks: updates.notes || defaultRemarks,
        actor: user,
      })
    );
  }

  await item.save();

  await createAuditLog({
    req,
    actionType: "appointment_status_updated",
    targetType: "appointment",
    targetId: item._id,
    changedFields: Object.keys(updates),
    oldValues,
    newValues: safeAuditSubset(item.toJSON(), APPOINTMENT_MANAGER_UPDATE_FIELDS),
  });

  await notifyUser({
    userId: item.citizenId,
    role: "citizen",
    municipalityId: item.municipalityId,
    barangayId: item.barangayId,
    type: "appointment",
    title: "Appointment updated",
    message: hasScheduleChange ? `${item.serviceName} was rescheduled. Current status: ${item.status}.` : `${item.serviceName} is now ${item.status}.`,
    entityType: "appointment",
    entityId: item._id,
  });

  return item;
}

export async function countAppointmentsForDashboard(user) {
  if (user.role === "citizen") {
    const [upcoming, completed] = await Promise.all([
      Appointment.countDocuments({ citizenId: user._id, status: { $in: ["pending", "confirmed"] } }),
      Appointment.countDocuments({ citizenId: user._id, status: "completed" }),
    ]);
    return { upcoming, completed };
  }

  const scope = managedAppointmentScope(user);
  const [upcoming, completed] = await Promise.all([
    Appointment.countDocuments({ ...scope, status: { $in: ["pending", "confirmed"] } }),
    Appointment.countDocuments({ ...scope, status: "completed" }),
  ]);

  return { upcoming, completed };
}
