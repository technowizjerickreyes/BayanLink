import mongoose from "mongoose";

const municipalitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Municipality name is required"],
      trim: true,
    },
    province: {
      type: String,
      required: [true, "Province is required"],
      trim: true,
    },
    mayor: {
      type: String,
      required: [true, "Mayor is required"],
      trim: true,
    },
    population: {
      type: Number,
      required: [true, "Population is required"],
      min: [0, "Population cannot be negative"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Municipality", municipalitySchema);
