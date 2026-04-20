import mongoose from "mongoose";

export const DRIVER_STATUSES = ["pending", "approved", "suspended", "revoked"];
export const VEHICLE_TYPES = ["motorcycle", "tricycle", "van", "jeepney", "bus", "other"];

const driverProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    municipalityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Municipality",
      required: true,
      index: true,
    },
    todaGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TODAGroup",
      default: null,
      index: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      maxlength: 40,
    },
    licenseExpiry: {
      type: Date,
      required: true,
    },
    vehiclePlateNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      maxlength: 20,
    },
    vehicleType: {
      type: String,
      enum: VEHICLE_TYPES,
      required: true,
    },
    vehicleModel: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    vehicleYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear() + 1,
      default: null,
    },
    orcrNumber: {
      type: String,
      uppercase: true,
      trim: true,
      maxlength: 40,
      default: "",
    },
    status: {
      type: String,
      enum: DRIVER_STATUSES,
      default: "pending",
      index: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    remarks: {
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

driverProfileSchema.index({ municipalityId: 1, status: 1, createdAt: -1 });
driverProfileSchema.index({ todaGroupId: 1, status: 1 });
driverProfileSchema.index({ licenseNumber: 1 });
driverProfileSchema.index({ vehiclePlateNumber: 1 });

driverProfileSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("DriverProfile", driverProfileSchema);