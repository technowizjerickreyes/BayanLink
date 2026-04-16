import AuditLog from "../models/AuditLog.js";

export function safeAuditSubset(source = {}, fields = []) {
  return fields.reduce((payload, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      payload[field] = source[field];
    }

    return payload;
  }, {});
}

export async function createAuditLog({ req, actionType, targetType, targetId = null, changedFields = [], oldValues = {}, newValues = {} }) {
  return AuditLog.create({
    actorUserId: req.user?._id || req.user?.id || null,
    actorRole: req.user?.role || null,
    actionType,
    targetType,
    targetId,
    changedFields,
    oldValues,
    newValues,
    ipAddress: req.ip || req.socket?.remoteAddress || "",
    userAgent: req.get?.("user-agent") || "",
  });
}

export async function listAuditLogs({ page, limit, skip, filters = {} }) {
  const [items, total] = await Promise.all([
    AuditLog.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("actorUserId", "firstName lastName email role")
      .lean(),
    AuditLog.countDocuments(filters),
  ]);

  return { items, total };
}
