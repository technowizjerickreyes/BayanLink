import express from "express";
import {
  addCitizenComplaint,
  browseCitizenComplaints,
  browseManagedComplaints,
  editManagedComplaint,
  readCitizenComplaint,
} from "../controllers/complaintReportController.js";
import validateRequest, { rejectUnknownBody } from "../middleware/validateRequest.js";
import { mongoIdParam } from "../validators/commonValidators.js";
import {
  complaintCreateAllowedFields,
  complaintListValidators,
  complaintUpdateAllowedFields,
  createComplaintValidators,
  updateComplaintValidators,
} from "../validators/complaintReportValidators.js";

export const citizenComplaintRouter = express.Router();
citizenComplaintRouter.get("/", complaintListValidators, validateRequest, browseCitizenComplaints);
citizenComplaintRouter.post("/", rejectUnknownBody(complaintCreateAllowedFields), createComplaintValidators, validateRequest, addCitizenComplaint);
citizenComplaintRouter.get("/:id", mongoIdParam("id"), validateRequest, readCitizenComplaint);

export const managedComplaintRouter = express.Router();
managedComplaintRouter.get("/", complaintListValidators, validateRequest, browseManagedComplaints);
managedComplaintRouter.patch(
  "/:id",
  mongoIdParam("id"),
  rejectUnknownBody(complaintUpdateAllowedFields),
  updateComplaintValidators,
  validateRequest,
  editManagedComplaint
);
