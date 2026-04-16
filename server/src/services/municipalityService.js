import mongoose from "mongoose";
import Municipality, { MUNICIPALITY_EDITABLE_FIELDS } from "../models/Municipality.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { assertOnlyFields, pickFields } from "../utils/fieldWhitelist.js";
import { getPaginationMeta } from "../utils/pagination.js";
import { createAuditLog, listAuditLogs, safeAuditSubset } from "./auditService.js";

const MUNICIPALITY_AUDIT_FIELDS = [
  "code",
  "name",
  "province",
  "region",
  "officialEmail",
  "officialContactNumber",
  "officeAddress",
  "logoUrl",
  "status",
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildMunicipalityFilters(query = {}) {
  const filters = { deletedAt: null };

  if (query.status) {
    filters.status = query.status;
  }

  if (query.search) {
    const search = new RegExp(escapeRegExp(query.search), "i");
    filters.$or = [{ code: search }, { name: search }, { province: search }, { region: search }];
  }

  return filters;
}

function getSort(sort = "-createdAt") {
  const allowed = {
    createdAt: { createdAt: 1 },
    "-createdAt": { createdAt: -1 },
    name: { name: 1 },
    "-name": { name: -1 },
    province: { province: 1 },
    "-province": { province: -1 },
    status: { status: 1 },
    "-status": { status: -1 },
  };

  return allowed[sort] || allowed["-createdAt"];
}

export async function listMunicipalities({ query, pagination }) {
  const filters = buildMunicipalityFilters(query);
  const sort = getSort(query.sort);

  const [items, total] = await Promise.all([
    Municipality.find(filters).sort(sort).skip(pagination.skip).limit(pagination.limit).lean(),
    Municipality.countDocuments(filters),
  ]);

  return {
    items,
    meta: getPaginationMeta({ ...pagination, total }),
  };
}

export async function getMunicipalityWithAudit(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid municipality id");
  }

  const municipality = await Municipality.findOne({ _id: id, deletedAt: null }).lean();

  if (!municipality) {
    throw new ApiError(404, "Municipality not found");
  }

  const auditLogs = await listAuditLogs({
    page: 1,
    limit: 20,
    skip: 0,
    filters: { targetType: "municipality", targetId: municipality._id },
  });

  return {
    municipality,
    auditLogs: auditLogs.items,
  };
}

export async function createMunicipality({ req, payload }) {
  const municipality = await Municipality.create({
    ...pickFields(payload, MUNICIPALITY_AUDIT_FIELDS),
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });

  await createAuditLog({
    req,
    actionType: "municipality_created",
    targetType: "municipality",
    targetId: municipality._id,
    changedFields: MUNICIPALITY_AUDIT_FIELDS,
    oldValues: {},
    newValues: safeAuditSubset(municipality.toObject(), MUNICIPALITY_AUDIT_FIELDS),
  });

  return municipality;
}

export async function updateMunicipality({ req, id, payload }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid municipality id");
  }

  assertOnlyFields(payload, MUNICIPALITY_EDITABLE_FIELDS, "Only limited municipality fields can be edited");
  const updatePayload = pickFields(payload, MUNICIPALITY_EDITABLE_FIELDS);

  if (Object.keys(updatePayload).length === 0) {
    throw new ApiError(400, "At least one editable field is required");
  }

  const existing = await Municipality.findOne({ _id: id, deletedAt: null });

  if (!existing) {
    throw new ApiError(404, "Municipality not found");
  }

  const oldObject = existing.toObject();
  const next = await Municipality.findOneAndUpdate(
    { _id: id, deletedAt: null },
    {
      $set: {
        ...updatePayload,
        updatedBy: req.user._id,
      },
    },
    { new: true, runValidators: true }
  );

  const nextObject = next.toObject();
  const changedFields = MUNICIPALITY_EDITABLE_FIELDS.filter((field) => String(oldObject[field] ?? "") !== String(nextObject[field] ?? ""));

  if (changedFields.length > 0) {
    await createAuditLog({
      req,
      actionType: "municipality_updated",
      targetType: "municipality",
      targetId: next._id,
      changedFields,
      oldValues: safeAuditSubset(oldObject, changedFields),
      newValues: safeAuditSubset(nextObject, changedFields),
    });
  }

  return next;
}

export async function listMunicipalityAuditLogs({ query, pagination }) {
  const filters = {};

  if (query.targetId && mongoose.Types.ObjectId.isValid(query.targetId)) {
    filters.targetId = query.targetId;
  }

  if (query.actionType) {
    filters.actionType = query.actionType;
  }

  const { items, total } = await listAuditLogs({
    page: pagination.page,
    limit: pagination.limit,
    skip: pagination.skip,
    filters,
  });

  return {
    items,
    meta: getPaginationMeta({ ...pagination, total }),
  };
}

export async function assignMunicipalAdmin({ req, municipalityId, payload }) {
  if (!mongoose.Types.ObjectId.isValid(municipalityId)) {
    throw new ApiError(400, "Invalid municipality id");
  }

  const municipality = await Municipality.findOne({ _id: municipalityId, deletedAt: null }).lean();

  if (!municipality) {
    throw new ApiError(404, "Municipality not found");
  }

  let user = await User.findOne({ email: payload.email }).select("+passwordHash");

  if (user && user.role !== "municipal_admin") {
    throw new ApiError(409, "A non-municipal-admin account already uses this email");
  }

  if (!user) {
    user = await User.create({
      email: payload.email,
      passwordHash: await User.hashPassword(payload.password),
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone || "",
      role: "municipal_admin",
      municipalityId,
      barangayId: "",
      status: "active",
    });
  } else {
    user.municipalityId = municipalityId;
    user.status = "active";
    await user.save();
  }

  await createAuditLog({
    req,
    actionType: "municipal_admin_assigned",
    targetType: "municipality",
    targetId: municipalityId,
    changedFields: ["municipalityId", "role"],
    oldValues: {},
    newValues: {
      assignedUserId: user._id,
      email: user.email,
      role: user.role,
      municipalityId,
    },
  });

  return user;
}
