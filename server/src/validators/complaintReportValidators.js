import { body, query } from "express-validator";
import { COMPLAINT_CATEGORIES } from "../constants/phase1Catalog.js";
import { COMPLAINT_PRIORITIES, COMPLAINT_STATUSES } from "../models/ComplaintReport.js";

export const complaintCreateAllowedFields = ["category", "title", "description", "attachments", "location"];
export const complaintUpdateAllowedFields = ["status", "priority", "assignedOffice", "remarks"];

const attachmentValidators = [
  body("attachments").optional().isArray({ max: 5 }).withMessage("Attachments must be an array with at most 5 items"),
  body("attachments.*.originalName").optional().trim().isLength({ min: 1, max: 180 }).withMessage("Attachment name is invalid"),
  body("attachments.*.fileName").optional().trim().isLength({ min: 1, max: 180 }).withMessage("Attachment file name is invalid"),
  body("attachments.*.mimeType").optional().trim().isLength({ min: 1, max: 120 }).withMessage("Attachment type is invalid"),
  body("attachments.*.size").optional().isInt({ min: 1 }).withMessage("Attachment size is invalid").toInt(),
  body("attachments.*.url").optional().trim().isURL({ require_protocol: true }).withMessage("Attachment URL must be valid"),
];

export const complaintListValidators = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100").toInt(),
  query("status").optional().isIn(COMPLAINT_STATUSES).withMessage("Status filter is invalid"),
  query("category").optional().isIn(COMPLAINT_CATEGORIES).withMessage("Category filter is invalid"),
  query("search").optional().trim().isLength({ max: 120 }).withMessage("Search is too long"),
];

export const createComplaintValidators = [
  body("category").isIn(COMPLAINT_CATEGORIES).withMessage("Category is invalid"),
  body("title").trim().isLength({ min: 3, max: 180 }).withMessage("Title must be 3 to 180 characters"),
  body("description").trim().isLength({ min: 10, max: 4000 }).withMessage("Description must be 10 to 4000 characters"),
  body("location").isObject().withMessage("Location details are required"),
  body("location.address").trim().isLength({ min: 5, max: 240 }).withMessage("Address must be 5 to 240 characters"),
  body("location.barangayId").optional({ values: "falsy" }).trim().isLength({ max: 80 }).withMessage("Barangay is too long"),
  body("location.landmark").optional({ values: "falsy" }).trim().isLength({ max: 180 }).withMessage("Landmark is too long"),
  body("location.latitude").optional({ values: "falsy" }).isFloat({ min: -90, max: 90 }).withMessage("Latitude is invalid").toFloat(),
  body("location.longitude").optional({ values: "falsy" }).isFloat({ min: -180, max: 180 }).withMessage("Longitude is invalid").toFloat(),
  ...attachmentValidators,
];

export const updateComplaintValidators = [
  body("status").optional().isIn(COMPLAINT_STATUSES).withMessage("Status is invalid"),
  body("priority").optional().isIn(COMPLAINT_PRIORITIES).withMessage("Priority is invalid"),
  body("assignedOffice").optional({ values: "falsy" }).trim().isLength({ max: 160 }).withMessage("Assigned office is too long"),
  body("remarks").optional({ values: "falsy" }).trim().isLength({ max: 1000 }).withMessage("Remarks are too long"),
];
