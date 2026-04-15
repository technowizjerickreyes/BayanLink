import mongoose from "mongoose";

const newsFeedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Ayuda", "Emergency", "Projects", "Events", "Health", "General"],
      default: "General",
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("NewsFeed", newsFeedSchema);
