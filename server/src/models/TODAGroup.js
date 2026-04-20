import mongoose from "mongoose";

export const TODA_STATUSES = ["active", "inactive", "suspended"];

const todaGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "TODA name is required"],
      trim: true,
      maxlength: 140,
    },
    code: {
      type: String,
      required: [true, "TODA code is required"],
      uppercase: true,
      trim: true,
      maxlength: 32,
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
    presidentName: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "",
    },
    contactNumber: {
      type: String,
      trim: true,
      maxlength: 32,
      default: "",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      maxlength: 254,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      maxlength: 280,
      default: "",
    },
    membershipCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: TODA_STATUSES,
      default: "active",
      index: true,
    },
    establishedDate: {
      type: Date,
      default: null,
    },
    notes: {
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

todaGroupSchema.index({ municipalityId: 1, code: 1 }, { unique: true });
todaGroupSchema.index({ municipalityId: 1, barangayId: 1, status: 1 });
todaGroupSchema.index({ name: "text" });

todaGroupSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("TODAGroup", todaGroupSchema);