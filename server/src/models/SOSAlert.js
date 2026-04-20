import mongoose from "mongoose";

export const SOS_STATUSES = ["active", "dispatched", "resolved", "cancelled"];
export const SOS_TYPES = ["emergency", "medical", "fire", "crime", "accident", "disaster", "other"];
export const SOS_PRIORITIES = ["low", "medium", "high", "critical"];

const sosLocationSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280,
    },
    barangayId: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    landmark: {
      type: String,
      trim: true,
      maxlength: 180,
      default: "",
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },
  { _id: false }
);

const sosTimelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: SOS_STATUSES,
      required: true,
    },
    action: {
      type: String,
      trim: true,
      maxlength: 240,
      default: "",
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const sosAlertSchema = new mongoose.Schema(
  {
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
      trim: true,
      maxlength: 80,
      default: "",
      index: true,
    },
    sosType: {
      type: String,
      enum: SOS_TYPES,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    location: {
      type: sosLocationSchema,
      required: true,
    },
    status: {
      type: String,
      enum: SOS_STATUSES,
      default: "active",
      index: true,
    },
    priority: {
      type: String,
      enum: SOS_PRIORITIES,
      default: "high",
      index: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    contactNumber: {
      type: String,
      trim: true,
      maxlength: 32,
      default: "",
    },
    assignedResponderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    timeline: {
      type: [sosTimelineSchema],
      default: [],
    },
  },
  {
    strict: "throw",
    timestamps: true,
  }
);

sosAlertSchema.index({ municipalityId: 1, status: 1, createdAt: -1 });
sosAlertSchema.index({ citizenId: 1, createdAt: -1 });
sosAlertSchema.index({ sosType: 1, status: 1 });

sosAlertSchema.pre("validate", function setPriority() {
  if (this.sosType === "medical" || this.sosType === "fire") {
    this.priority = "critical";
  }
});

sosAlertSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("SOSAlert", sosAlertSchema);