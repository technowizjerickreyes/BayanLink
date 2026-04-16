import mongoose from "mongoose";
import { DOCUMENT_REQUEST_TYPE_VALUES } from "../constants/phase1Catalog.js";

export const DOCUMENT_REQUEST_STATUSES = ["pending", "under_review", "approved", "rejected", "for_pickup", "completed", "cancelled"];
export const DOCUMENT_PAYMENT_STATUSES = ["not_applicable", "pending", "paid", "failed", "refunded"];

const attachmentSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    size: {
      type: Number,
      required: true,
      min: 1,
    },
    url: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const documentRequestSchema = new mongoose.Schema(
  {
    scope: {
      type: String,
      enum: ["municipality", "barangay"],
      required: true,
      index: true,
    },
    requestType: {
      type: String,
      enum: DOCUMENT_REQUEST_TYPE_VALUES,
      required: true,
      index: true,
    },
    serviceName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    municipalityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Municipality",
      required: true,
      index: true,
    },
    barangayId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },
    submittedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 40,
      index: true,
    },
    status: {
      type: String,
      enum: DOCUMENT_REQUEST_STATUSES,
      default: "pending",
      index: true,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: DOCUMENT_PAYMENT_STATUSES,
      default: "not_applicable",
      index: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
      index: true,
    },
    pickupSchedule: {
      type: Date,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    strict: "throw",
    timestamps: true,
  }
);

documentRequestSchema.index({ municipalityId: 1, barangayId: 1, scope: 1, status: 1, createdAt: -1 });
documentRequestSchema.index({ citizenId: 1, createdAt: -1 });
documentRequestSchema.index({ requestType: 1, municipalityId: 1, status: 1 });

documentRequestSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("DocumentRequest", documentRequestSchema);
