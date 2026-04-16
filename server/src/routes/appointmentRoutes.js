import express from "express";
import {
  addCitizenAppointment,
  browseAppointmentAvailability,
  browseCitizenAppointments,
  browseManagedAppointments,
  editCitizenAppointment,
  editManagedAppointment,
  readCitizenAppointment,
  readManagedAppointment,
} from "../controllers/appointmentController.js";
import validateRequest, { rejectUnknownBody } from "../middleware/validateRequest.js";
import { mongoIdParam } from "../validators/commonValidators.js";
import {
  appointmentAvailabilityValidators,
  appointmentCitizenUpdateAllowedFields,
  appointmentCreateAllowedFields,
  appointmentListValidators,
  appointmentManagerUpdateAllowedFields,
  createAppointmentValidators,
  updateCitizenAppointmentValidators,
  updateManagedAppointmentValidators,
} from "../validators/appointmentValidators.js";

export const citizenAppointmentRouter = express.Router();
citizenAppointmentRouter.get("/", appointmentListValidators, validateRequest, browseCitizenAppointments);
citizenAppointmentRouter.get("/availability", appointmentAvailabilityValidators, validateRequest, browseAppointmentAvailability);
citizenAppointmentRouter.get("/:id", mongoIdParam("id"), validateRequest, readCitizenAppointment);
citizenAppointmentRouter.post("/", rejectUnknownBody(appointmentCreateAllowedFields), createAppointmentValidators, validateRequest, addCitizenAppointment);
citizenAppointmentRouter.patch(
  "/:id",
  mongoIdParam("id"),
  rejectUnknownBody(appointmentCitizenUpdateAllowedFields),
  updateCitizenAppointmentValidators,
  validateRequest,
  editCitizenAppointment
);

export const managedAppointmentRouter = express.Router();
managedAppointmentRouter.get("/", appointmentListValidators, validateRequest, browseManagedAppointments);
managedAppointmentRouter.get("/availability", appointmentAvailabilityValidators, validateRequest, browseAppointmentAvailability);
managedAppointmentRouter.get("/:id", mongoIdParam("id"), validateRequest, readManagedAppointment);
managedAppointmentRouter.patch(
  "/:id",
  mongoIdParam("id"),
  rejectUnknownBody(appointmentManagerUpdateAllowedFields),
  updateManagedAppointmentValidators,
  validateRequest,
  editManagedAppointment
);
