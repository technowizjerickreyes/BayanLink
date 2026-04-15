import mongoose from "mongoose";
import NewsFeed from "../models/NewsFeed.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const browseNewsFeeds = async (req, res, next) => {
  try {
    const items = await NewsFeed.find().sort({ isPinned: -1, createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const readNewsFeed = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid news post id" });
    }

    const item = await NewsFeed.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "News post not found" });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const addNewsFeed = async (req, res, next) => {
  try {
    const item = await NewsFeed.create(req.body);
    res.status(201).json({ success: true, message: "News post created", data: item });
  } catch (error) {
    next(error);
  }
};

export const editNewsFeed = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid news post id" });
    }

    const item = await NewsFeed.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: "News post not found" });
    }

    res.status(200).json({ success: true, message: "News post updated", data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteNewsFeed = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid news post id" });
    }

    const item = await NewsFeed.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "News post not found" });
    }

    res.status(200).json({ success: true, message: "News post deleted" });
  } catch (error) {
    next(error);
  }
};
