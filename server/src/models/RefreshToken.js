import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },
    replacedByTokenHash: {
      type: String,
      default: "",
    },
    createdByIp: {
      type: String,
      default: "",
      maxlength: 80,
    },
    revokedByIp: {
      type: String,
      default: "",
      maxlength: 80,
    },
    userAgent: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  { timestamps: true }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ userId: 1, revokedAt: 1, expiresAt: 1 });

export default mongoose.model("RefreshToken", refreshTokenSchema);
