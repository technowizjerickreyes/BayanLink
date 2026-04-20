import mongoose from "mongoose";

export const ANALYTICS_EVENTS = [
  "page_view",
  "user_login",
  "user_logout",
  "document_request",
  "appointment_created",
  "appointment_cancelled",
  "complaint_filed",
  "news_viewed",
  "search_performed",
  "sos_triggered",
];

export const ANALYTICS_SCOPES = ["public", "citizen", "municipal", "barangay", "super_admin"];

const analyticsLogSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      enum: ANALYTICS_EVENTS,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    sessionId: {
      type: String,
      trim: true,
      maxlength: 64,
      default: null,
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
    },
    scope: {
      type: String,
      enum: ANALYTICS_SCOPES,
      default: "public",
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    userAgent: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    ipAddress: {
      type: String,
      trim: true,
      maxlength: 45,
      default: "",
    },
    referrer: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    strict: "throw",
    timestamps: true,
  }
);

analyticsLogSchema.index({ event: 1, createdAt: -1 });
analyticsLogSchema.index({ municipalityId: 1, event: 1, createdAt: -1 });
analyticsLogSchema.index({ userId: 1, createdAt: -1 });
analyticsLogSchema.index({ scope: 1, createdAt: -1 });

analyticsLogSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
    delete ret.ipAddress;
    return ret;
  },
});

export default mongoose.model("AnalyticsLog", analyticsLogSchema);