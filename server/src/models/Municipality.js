import mongoose from "mongoose";

export const MUNICIPALITY_EDITABLE_FIELDS = ["officialEmail", "officialContactNumber", "officeAddress", "logoUrl", "status"];
export const MUNICIPALITY_PROTECTED_FIELDS = ["code", "name", "province", "region", "createdBy", "createdAt"];

const municipalitySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Municipality code is required"],
      unique: true,
      immutable: true,
      uppercase: true,
      trim: true,
      minlength: 2,
      maxlength: 32,
      match: [/^[A-Z0-9_-]+$/, "Municipality code may only contain letters, numbers, underscores, and hyphens"],
    },
    name: {
      type: String,
      required: [true, "Municipality name is required"],
      immutable: true,
      trim: true,
      maxlength: 140,
    },
    province: {
      type: String,
      required: [true, "Province is required"],
      immutable: true,
      trim: true,
      maxlength: 140,
    },
    region: {
      type: String,
      required: [true, "Region is required"],
      immutable: true,
      trim: true,
      maxlength: 140,
    },
    officialEmail: {
      type: String,
      required: [true, "Official email is required"],
      lowercase: true,
      trim: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Official email must be valid"],
    },
    officialContactNumber: {
      type: String,
      required: [true, "Official contact number is required"],
      trim: true,
      maxlength: 32,
      match: [/^[0-9+()\-.\s]{7,32}$/, "Official contact number must be valid"],
    },
    officeAddress: {
      type: String,
      required: [true, "Office address is required"],
      trim: true,
      maxlength: 280,
    },
    logoUrl: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      immutable: true,
      default: null,
    },
    updatedBy: {
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

municipalitySchema.index({ name: 1, province: 1 });
municipalitySchema.index({ status: 1, deletedAt: 1, createdAt: -1 });

function getUpdatedFields(update) {
  if (Array.isArray(update)) {
    return ["pipelineUpdate"];
  }

  const directFields = Object.keys(update || {}).filter((key) => !key.startsWith("$"));
  const setFields = Object.keys(update?.$set || {});
  const unsetFields = Object.keys(update?.$unset || {});

  return [...new Set([...directFields, ...setFields, ...unsetFields])];
}

function protectImmutableFields() {
  const update = this.getUpdate();
  const changedFields = getUpdatedFields(update);
  const protectedAttempt = changedFields.filter((field) => MUNICIPALITY_PROTECTED_FIELDS.includes(field));

  if (protectedAttempt.length > 0 || changedFields.includes("pipelineUpdate")) {
    const error = new Error("Protected municipality fields cannot be edited after creation");
    error.statusCode = 400;
    error.details = { protectedFields: protectedAttempt };
    throw error;
  }
}

municipalitySchema.pre("findOneAndUpdate", protectImmutableFields);
municipalitySchema.pre("updateOne", protectImmutableFields);
municipalitySchema.pre("updateMany", protectImmutableFields);

municipalitySchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Municipality", municipalitySchema);
