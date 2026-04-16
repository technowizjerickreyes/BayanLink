import mongoose from "mongoose";
import { USER_ROLES } from "./Role.js";
import { DOCUMENT_REQUEST_STATUSES } from "./DocumentRequest.js";

const documentRequestTimelineSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocumentRequest",
      required: true,
      index: true,
    },
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
    fromStatus: {
      type: String,
      enum: DOCUMENT_REQUEST_STATUSES,
      default: null,
    },
    toStatus: {
      type: String,
      enum: DOCUMENT_REQUEST_STATUSES,
      required: true,
      index: true,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    visibility: {
      type: String,
      enum: ["public", "internal"],
      default: "public",
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

documentRequestTimelineSchema.index({ requestId: 1, createdAt: 1 });

documentRequestTimelineSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("DocumentRequestTimeline", documentRequestTimelineSchema);
