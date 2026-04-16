import mongoose from "mongoose";
import { APPOINTMENT_SERVICE_VALUES } from "../constants/phase1Catalog.js";
import { USER_ROLES } from "./Role.js";

export const APPOINTMENT_SCOPES = ["municipality", "barangay"];
export const APPOINTMENT_STATUSES = ["pending", "confirmed", "completed", "cancelled"];

const appointmentHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: APPOINTMENT_STATUSES,
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    changedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    changedByRole: {
      type: String,
      enum: USER_ROLES,
      default: null,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema(
  {
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    serviceId: {
      type: String,
      enum: APPOINTMENT_SERVICE_VALUES,
      required: true,
      index: true,
    },
    serviceName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    municipalityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Municipality",
      required: true,
      index: true,
    },
    barangayId: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
      index: true,
    },
    scope: {
      type: String,
      enum: APPOINTMENT_SCOPES,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    timeSlot: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{2}:\d{2}$/, "Time slot must use 24-hour HH:mm format"],
    },
    endTimeSlot: {
      type: String,
      trim: true,
      match: [/^\d{2}:\d{2}$/, "End time slot must use 24-hour HH:mm format"],
      default: "",
    },
    status: {
      type: String,
      enum: APPOINTMENT_STATUSES,
      default: "pending",
      index: true,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
      maxlength: 240,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    linkedRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocumentRequest",
      default: null,
      index: true,
    },
    history: {
      type: [appointmentHistorySchema],
      default: [],
    },
    createdByRole: {
      type: String,
      enum: USER_ROLES,
      default: "citizen",
    },
  },
  {
    strict: "throw",
    timestamps: true,
  }
);

appointmentSchema.pre("validate", function enforceScope() {
  if (this.scope === "municipality") {
    this.barangayId = "";
  }
});

appointmentSchema.index(
  { municipalityId: 1, barangayId: 1, scope: 1, date: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "confirmed"] },
    },
  }
);
appointmentSchema.index({ citizenId: 1, status: 1, date: -1 });

appointmentSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Appointment", appointmentSchema);
