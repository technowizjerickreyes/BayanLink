import mongoose from "mongoose";
import { COMPLAINT_CATEGORIES } from "../constants/phase1Catalog.js";
import { USER_ROLES } from "./Role.js";

export const COMPLAINT_STATUSES = ["submitted", "under_review", "in_progress", "resolved", "rejected", "closed"];
export const COMPLAINT_PRIORITIES = ["low", "medium", "high", "urgent"];

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

const complaintTimelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: COMPLAINT_STATUSES,
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    actorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    actorRole: {
      type: String,
      enum: USER_ROLES,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const complaintReportSchema = new mongoose.Schema(
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
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },
    category: {
      type: String,
      enum: COMPLAINT_CATEGORIES,
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
      maxlength: 4000,
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    location: {
      address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 240,
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
        min: -90,
        max: 90,
        default: null,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
        default: null,
      },
    },
    status: {
      type: String,
      enum: COMPLAINT_STATUSES,
      default: "submitted",
      index: true,
    },
    priority: {
      type: String,
      enum: COMPLAINT_PRIORITIES,
      default: "medium",
      index: true,
    },
    assignedOffice: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "",
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
    timeline: {
      type: [complaintTimelineSchema],
      default: [],
    },
  },
  {
    strict: "throw",
    timestamps: true,
  }
);

complaintReportSchema.pre("validate", function syncLocationScope() {
  if (this.location?.barangayId) {
    this.barangayId = this.location.barangayId;
  }
});

complaintReportSchema.index({ municipalityId: 1, barangayId: 1, category: 1, status: 1, createdAt: -1 });
complaintReportSchema.index({ citizenId: 1, createdAt: -1 });

complaintReportSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("ComplaintReport", complaintReportSchema);
