import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { USER_ROLES } from "./Role.js";

const PASSWORD_HASH_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: 80,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: 80,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 32,
      default: "",
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "citizen",
      index: true,
    },
    municipalityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Municipality",
      index: true,
      default: null,
    },
    barangayId: {
      type: String,
      trim: true,
      maxlength: 80,
      index: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "pending", "suspended", "locked"],
      default: "active",
      index: true,
    },
    failedLoginCount: {
      type: Number,
      default: 0,
      min: 0,
      select: false,
    },
    lockUntil: {
      type: Date,
      default: null,
      select: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.index({ role: 1, municipalityId: 1, barangayId: 1, status: 1 });

userSchema.pre("validate", function requireScopedRole() {
  if (this.role !== "super_admin" && !this.municipalityId) {
    this.invalidate("municipalityId", "Municipality is required for this role");
  }

  if (["citizen", "barangay_admin"].includes(this.role) && !this.barangayId) {
    this.invalidate("barangayId", "Barangay is required for this role");
  }
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
};

userSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.passwordHash;
    delete ret.failedLoginCount;
    delete ret.lockUntil;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
