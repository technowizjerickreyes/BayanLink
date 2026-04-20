import mongoose from "mongoose";

export const INQUIRY_STATUSES = ["pending", "answered", "escalated", "closed"];
export const INQUIRY_CATEGORIES = [
  "document_request",
  "appointment",
  "complaint",
  "payment",
  "toda_driver",
  "announcement",
  "general",
];

const chatbotInquirySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 64,
      index: true,
    },
    municipalityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Municipality",
      default: null,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: INQUIRY_CATEGORIES,
      default: "general",
      index: true,
    },
    detectedIntent: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    botResponse: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    status: {
      type: String,
      enum: INQUIRY_STATUSES,
      default: "pending",
      index: true,
    },
    isEscalated: {
      type: Boolean,
      default: false,
    },
    escalatedToUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    strict: "throw",
    timestamps: true,
  }
);

chatbotInquirySchema.index({ sessionId: 1, createdAt: -1 });
chatbotInquirySchema.index({ municipalityId: 1, status: 1, createdAt: -1 });
chatbotInquirySchema.index({ category: 1, status: 1 });
chatbotInquirySchema.index({ userId: 1, createdAt: -1 });

chatbotInquirySchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("ChatbotInquiry", chatbotInquirySchema);