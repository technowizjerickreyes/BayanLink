import { body, query } from "express-validator";
import { APPOINTMENT_STATUSES } from "../models/Appointment.js";
import { APPOINTMENT_SERVICE_VALUES } from "../constants/phase1Catalog.js";

export const appointmentCreateAllowedFields = ["serviceId", "date", "timeSlot", "endTimeSlot", "purpose", "notes", "linkedRequestId"];
export const appointmentCitizenUpdateAllowedFields = ["date", "timeSlot", "endTimeSlot", "purpose", "notes", "status"];
export const appointmentManagerUpdateAllowedFields = ["status", "notes", "date", "timeSlot", "endTimeSlot"];

export const appointmentListValidators = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100").toInt(),
  query("status").optional().isIn(APPOINTMENT_STATUSES).withMessage("Status filter is invalid"),
  query("serviceId").optional().isIn(APPOINTMENT_SERVICE_VALUES).withMessage("Service filter is invalid"),
  query("dateFrom").optional().isISO8601().withMessage("Start date filter is invalid"),
  query("dateTo").optional().isISO8601().withMessage("End date filter is invalid"),
  query("search").optional().trim().isLength({ max: 120 }).withMessage("Search is too long"),
];

export const appointmentAvailabilityValidators = [
  query("serviceId").isIn(APPOINTMENT_SERVICE_VALUES).withMessage("Service is invalid"),
  query("date").isISO8601().withMessage("Appointment date is invalid"),
  query("excludeId").optional({ values: "falsy" }).isMongoId().withMessage("Exclude id is invalid"),
  query("barangayId").optional({ values: "falsy" }).trim().isLength({ max: 80 }).withMessage("Barangay filter is invalid"),
];

export const createAppointmentValidators = [
  body("serviceId").isIn(APPOINTMENT_SERVICE_VALUES).withMessage("Service is invalid"),
  body("date").isISO8601().withMessage("Appointment date is invalid"),
  body("timeSlot").matches(/^\d{2}:\d{2}$/).withMessage("Time slot must use HH:mm format"),
  body("endTimeSlot").optional({ values: "falsy" }).matches(/^\d{2}:\d{2}$/).withMessage("End time must use HH:mm format"),
  body("purpose").trim().isLength({ min: 3, max: 240 }).withMessage("Purpose must be 3 to 240 characters"),
  body("notes").optional({ values: "falsy" }).trim().isLength({ max: 1000 }).withMessage("Notes are too long"),
  body("linkedRequestId").optional({ values: "falsy" }).isMongoId().withMessage("Linked request id is invalid"),
];

export const updateCitizenAppointmentValidators = [
  body("date").optional({ values: "falsy" }).isISO8601().withMessage("Appointment date is invalid"),
  body("timeSlot").optional({ values: "falsy" }).matches(/^\d{2}:\d{2}$/).withMessage("Time slot must use HH:mm format"),
  body("endTimeSlot").optional({ values: "falsy" }).matches(/^\d{2}:\d{2}$/).withMessage("End time must use HH:mm format"),
  body("purpose").optional({ values: "falsy" }).trim().isLength({ min: 3, max: 240 }).withMessage("Purpose must be 3 to 240 characters"),
  body("notes").optional({ values: "falsy" }).trim().isLength({ max: 1000 }).withMessage("Notes are too long"),
  body("status").optional({ values: "falsy" }).equals("cancelled").withMessage("Citizens can only cancel their own appointments"),
];

export const updateManagedAppointmentValidators = [
  body("status").optional().isIn(APPOINTMENT_STATUSES).withMessage("Status is invalid"),
  body("date").optional({ values: "falsy" }).isISO8601().withMessage("Appointment date is invalid"),
  body("timeSlot").optional({ values: "falsy" }).matches(/^\d{2}:\d{2}$/).withMessage("Time slot must use HH:mm format"),
  body("endTimeSlot").optional({ values: "falsy" }).matches(/^\d{2}:\d{2}$/).withMessage("End time must use HH:mm format"),
  body("notes").optional({ values: "falsy" }).trim().isLength({ max: 1000 }).withMessage("Notes are too long"),
];
