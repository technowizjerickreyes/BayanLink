import mongoose from "mongoose";
import { NOTIFICATION_TYPES } from "../constants/phase1Catalog.js";
import { USER_ROLES } from "./Role.js";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
      index: true,
    },
    municipalityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Municipality",
      default: null,
      index: true,
    },
    barangayId: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
      index: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    link: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    entityType: {
      type: String,
      enum: ["document_request", "appointment", "complaint", "system"],
      default: "system",
      index: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    strict: "throw",
    timestamps: { createdAt: true, updatedAt: false },
  }
);

notificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 });

notificationSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.isRead = Boolean(ret.readAt);
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Notification", notificationSchema);
