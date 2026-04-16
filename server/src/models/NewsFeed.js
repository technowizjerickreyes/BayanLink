import mongoose from "mongoose";

export const NEWS_STATUSES = ["draft", "published", "archived"];
export const NEWS_AUDIENCE_SCOPES = ["municipality", "barangay"];
export const NEWS_CATEGORIES = ["Ayuda", "Emergency", "Projects", "Events", "Health", "General"];

const newsFeedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 180,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: 12000,
    },
    imageUrl: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
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
    audienceScope: {
      type: String,
      enum: NEWS_AUDIENCE_SCOPES,
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: NEWS_STATUSES,
      default: "draft",
      index: true,
    },
    category: {
      type: String,
      enum: NEWS_CATEGORIES,
      default: "General",
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    strict: "throw",
    timestamps: true,
  }
);

newsFeedSchema.pre("validate", function validateAudienceScope(next) {
  if (this.audienceScope === "barangay" && !this.barangayId) {
    this.invalidate("barangayId", "Barangay is required for barangay-scoped posts");
  }

  if (this.audienceScope === "municipality") {
    this.barangayId = "";
  }

  next();
});

newsFeedSchema.index({ municipalityId: 1, audienceScope: 1, barangayId: 1, status: 1, publishedAt: -1, createdAt: -1 });
newsFeedSchema.index({ title: "text", content: "text" });

newsFeedSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("NewsFeed", newsFeedSchema);
