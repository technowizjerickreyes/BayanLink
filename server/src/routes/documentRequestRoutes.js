import express from "express";
import {
  addCitizenDocumentRequest,
  browseCitizenDocumentRequests,
  browseManagedDocumentRequests,
  editManagedDocumentRequest,
  readCitizenDocumentRequest,
  readManagedDocumentRequest,
} from "../controllers/documentRequestController.js";
import validateRequest, { rejectUnknownBody } from "../middleware/validateRequest.js";
import { mongoIdParam } from "../validators/commonValidators.js";
import {
  createDocumentRequestValidators,
  documentRequestCreateAllowedFields,
  documentRequestListValidators,
  documentRequestUpdateAllowedFields,
  updateDocumentRequestValidators,
} from "../validators/documentRequestValidators.js";

export const citizenDocumentRequestRouter = express.Router();
citizenDocumentRequestRouter.get("/", documentRequestListValidators, validateRequest, browseCitizenDocumentRequests);
citizenDocumentRequestRouter.post(
  "/",
  rejectUnknownBody(documentRequestCreateAllowedFields),
  createDocumentRequestValidators,
  validateRequest,
  addCitizenDocumentRequest
);
citizenDocumentRequestRouter.get("/:id", mongoIdParam("id"), validateRequest, readCitizenDocumentRequest);

export const managedDocumentRequestRouter = express.Router();
managedDocumentRequestRouter.get("/", documentRequestListValidators, validateRequest, browseManagedDocumentRequests);
managedDocumentRequestRouter.get("/:id", mongoIdParam("id"), validateRequest, readManagedDocumentRequest);
managedDocumentRequestRouter.patch(
  "/:id",
  mongoIdParam("id"),
  rejectUnknownBody(documentRequestUpdateAllowedFields),
  updateDocumentRequestValidators,
  validateRequest,
  editManagedDocumentRequest
);
