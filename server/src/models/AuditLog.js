import mongoose from "mongoose";
import { USER_ROLES } from "./Role.js";

export const AUDIT_ACTIONS = [
  "municipality_created",
  "municipality_updated",
  "municipal_admin_assigned",
  "failed_super_admin_login",
  "successful_super_admin_login",
  "document_request_status_updated",
  "appointment_status_updated",
  "complaint_status_updated",
];

const auditLogSchema = new mongoose.Schema(
  {
    actorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    actorRole: {
      type: String,
      enum: USER_ROLES,
      default: null,
      index: true,
    },
    actionType: {
      type: String,
      enum: AUDIT_ACTIONS,
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ["municipality", "auth", "user", "document_request", "appointment", "complaint"],
      required: true,
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    changedFields: {
      type: [String],
      default: [],
    },
    oldValues: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    newValues: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: "",
      maxlength: 80,
    },
    userAgent: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

auditLogSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
auditLogSchema.index({ actionType: 1, createdAt: -1 });

export default mongoose.model("AuditLog", auditLogSchema);
