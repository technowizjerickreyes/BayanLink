import asyncHandler from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";
import { sendSuccess } from "../utils/apiResponse.js";
import {
  createCitizenAppointment,
  listCitizenAppointments,
  listManagedAppointments,
  updateCitizenAppointment,
  updateManagedAppointment,
} from "../services/appointmentService.js";

export const browseCitizenAppointments = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.validated.query);
  const result = await listCitizenAppointments({ user: req.user, query: req.validated.query, pagination });

  return sendSuccess(res, {
    message: "Appointments loaded",
    data: result.items,
    meta: result.meta,
  });
});

export const addCitizenAppointment = asyncHandler(async (req, res) => {
  const item = await createCitizenAppointment({ user: req.user, payload: req.validated.body });

  return sendSuccess(res, {
    statusCode: 201,
    message: "Appointment created",
    data: item,
  });
});

export const editCitizenAppointment = asyncHandler(async (req, res) => {
  const item = await updateCitizenAppointment({ user: req.user, id: req.params.id, payload: req.validated.body });

  return sendSuccess(res, {
    message: "Appointment updated",
    data: item,
  });
});

export const browseManagedAppointments = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.validated.query);
  const result = await listManagedAppointments({ user: req.user, query: req.validated.query, pagination });

  return sendSuccess(res, {
    message: "Managed appointments loaded",
    data: result.items,
    meta: result.meta,
  });
});

export const editManagedAppointment = asyncHandler(async (req, res) => {
  const item = await updateManagedAppointment({ req, user: req.user, id: req.params.id, payload: req.validated.body });

  return sendSuccess(res, {
    message: "Appointment updated",
    data: item,
  });
});
