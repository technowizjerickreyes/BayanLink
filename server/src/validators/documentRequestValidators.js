import { body, param, query } from "express-validator";
import { DOCUMENT_PAYMENT_STATUSES, DOCUMENT_REQUEST_STATUSES } from "../models/DocumentRequest.js";
import { DOCUMENT_REQUEST_TYPE_VALUES } from "../constants/phase1Catalog.js";

export const documentRequestCreateAllowedFields = ["requestType", "submittedData", "attachments", "appointmentId"];
export const documentRequestUpdateAllowedFields = ["status", "remarks", "assignedTo", "paymentStatus", "appointmentId", "pickupSchedule"];

const attachmentValidators = [
  body("attachments").optional().isArray({ max: 5 }).withMessage("Attachments must be an array with at most 5 items"),
  body("attachments.*.originalName").optional().trim().isLength({ min: 1, max: 180 }).withMessage("Attachment name is invalid"),
  body("attachments.*.fileName").optional().trim().isLength({ min: 1, max: 180 }).withMessage("Attachment file name is invalid"),
  body("attachments.*.mimeType").optional().trim().isLength({ min: 1, max: 120 }).withMessage("Attachment type is invalid"),
  body("attachments.*.size").optional().isInt({ min: 1 }).withMessage("Attachment size is invalid").toInt(),
  body("attachments.*.url").optional().trim().isURL({ require_protocol: true }).withMessage("Attachment URL must be valid"),
];

export const documentRequestListValidators = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100").toInt(),
  query("status").optional().isIn(DOCUMENT_REQUEST_STATUSES).withMessage("Status filter is invalid"),
  query("paymentStatus").optional().isIn(DOCUMENT_PAYMENT_STATUSES).withMessage("Payment status filter is invalid"),
  query("requestType").optional().isIn(DOCUMENT_REQUEST_TYPE_VALUES).withMessage("Request type filter is invalid"),
  query("search").optional().trim().isLength({ max: 120 }).withMessage("Search is too long"),
];

export const trackingNumberParamValidator = [
  param("trackingNumber")
    .trim()
    .matches(/^DOC-[A-Z0-9-]+$/i)
    .withMessage("Tracking number is invalid")
    .customSanitizer((value) => value.toUpperCase()),
];

export const createDocumentRequestValidators = [
  body("requestType").isIn(DOCUMENT_REQUEST_TYPE_VALUES).withMessage("Request type is invalid"),
  body("submittedData").isObject().withMessage("Submitted data is required"),
  body("submittedData.fullName").trim().isLength({ min: 2, max: 120 }).withMessage("Full name must be 2 to 120 characters"),
  body("submittedData.birthDate").optional({ values: "falsy" }).isISO8601().withMessage("Birth date is invalid"),
  body("submittedData.civilStatus").optional({ values: "falsy" }).trim().isLength({ max: 80 }).withMessage("Civil status is too long"),
  body("submittedData.purpose").trim().isLength({ min: 3, max: 240 }).withMessage("Purpose must be 3 to 240 characters"),
  body("submittedData.deliveryPreference").optional({ values: "falsy" }).trim().isLength({ max: 80 }).withMessage("Delivery preference is too long"),
  body("submittedData.notes").optional({ values: "falsy" }).trim().isLength({ max: 500 }).withMessage("Notes are too long"),
  body("appointmentId").optional({ values: "falsy" }).isMongoId().withMessage("Appointment id is invalid"),
  ...attachmentValidators,
];

export const updateDocumentRequestValidators = [
  body("status").optional().isIn(DOCUMENT_REQUEST_STATUSES).withMessage("Status is invalid"),
  body("remarks").optional().trim().isLength({ max: 1000 }).withMessage("Remarks are too long"),
  body("assignedTo").optional({ values: "falsy" }).isMongoId().withMessage("Assigned user id is invalid"),
  body("paymentStatus").optional().isIn(DOCUMENT_PAYMENT_STATUSES).withMessage("Payment status is invalid"),
  body("appointmentId").optional({ values: "falsy" }).isMongoId().withMessage("Appointment id is invalid"),
  body("pickupSchedule").optional({ values: "falsy" }).isISO8601().withMessage("Pickup schedule must be a valid date"),
];
