import mongoose from "mongoose";

export const USER_ROLES = ["super_admin", "municipal_admin", "barangay_admin", "citizen"];

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: USER_ROLES,
      required: true,
      unique: true,
      immutable: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 240,
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Role", roleSchema);
