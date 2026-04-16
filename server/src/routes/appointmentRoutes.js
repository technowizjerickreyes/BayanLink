import express from "express";
import { addCitizenAppointment, browseCitizenAppointments, browseManagedAppointments, editCitizenAppointment, editManagedAppointment } from "../controllers/appointmentController.js";
import validateRequest, { rejectUnknownBody } from "../middleware/validateRequest.js";
import { mongoIdParam } from "../validators/commonValidators.js";
import {
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
managedAppointmentRouter.patch(
  "/:id",
  mongoIdParam("id"),
  rejectUnknownBody(appointmentManagerUpdateAllowedFields),
  updateManagedAppointmentValidators,
  validateRequest,
  editManagedAppointment
);
