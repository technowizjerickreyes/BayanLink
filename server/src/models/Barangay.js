import mongoose from "mongoose";

export const BARANGAY_STATUSES = ["active", "inactive"];

const barangaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Barangay name is required"],
      trim: true,
      maxlength: 140,
    },
    code: {
      type: String,
      required: [true, "Barangay code is required"],
      unique: true,
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
    captainName: {
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
    status: {
      type: String,
      enum: BARANGAY_STATUSES,
      default: "active",
      index: true,
    },
    population: {
      type: Number,
      min: 0,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deletedAt: {
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

barangaySchema.index({ municipalityId: 1, code: 1 });
barangaySchema.index({ name: 1, municipalityId: 1 });
barangaySchema.index({ status: 1, deletedAt: 1 });

barangaySchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Barangay", barangaySchema);