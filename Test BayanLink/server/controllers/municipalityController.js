import mongoose from "mongoose";
import Municipality from "../models/Municipality.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const browseMunicipalities = async (req, res, next) => {
  try {
    const items = await Municipality.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const readMunicipality = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid municipality id" });
    }

    const item = await Municipality.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Municipality not found" });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const addMunicipality = async (req, res, next) => {
  try {
    const item = await Municipality.create(req.body);
    res.status(201).json({ success: true, message: "Municipality created", data: item });
  } catch (error) {
    next(error);
  }
};

export const editMunicipality = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid municipality id" });
    }

    const item = await Municipality.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: "Municipality not found" });
    }

    res.status(200).json({ success: true, message: "Municipality updated", data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteMunicipality = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid municipality id" });
    }

    const item = await Municipality.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Municipality not found" });
    }

    res.status(200).json({ success: true, message: "Municipality deleted" });
  } catch (error) {
    next(error);
  }
};
