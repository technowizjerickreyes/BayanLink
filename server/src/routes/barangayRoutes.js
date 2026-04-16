import express from "express";
import { barangayDashboard } from "../controllers/barangayController.js";
import {
  addManagedNewsFeed,
  archiveManagedNewsFeed,
  browseManagedNewsFeeds,
  editManagedNewsFeed,
  readManagedNewsFeed,
} from "../controllers/newsFeedController.js";
import { managedAppointmentRouter } from "./appointmentRoutes.js";
import { managedComplaintRouter } from "./complaintReportRoutes.js";
import { managedDocumentRequestRouter } from "./documentRequestRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import requireAuth from "../middleware/requireAuth.js";
import requireRole from "../middleware/requireRole.js";
import validateRequest, { rejectUnknownBody } from "../middleware/validateRequest.js";
import { mongoIdParam } from "../validators/commonValidators.js";
import {
  createNewsFeedValidators,
  newsFeedCreateAllowedFields,
  newsFeedListValidators,
  newsFeedUpdateAllowedFields,
  updateNewsFeedValidators,
} from "../validators/newsFeedValidators.js";

const router = express.Router();

router.use(requireAuth, requireRole("barangay_admin"));

router.get("/dashboard", barangayDashboard);
router.use("/document-requests", managedDocumentRequestRouter);
router.use("/appointments", managedAppointmentRouter);
router.use("/complaints", managedComplaintRouter);
router.use("/notifications", notificationRoutes);
router.get("/news-feeds", newsFeedListValidators, validateRequest, browseManagedNewsFeeds);
router.post("/news-feeds", rejectUnknownBody(newsFeedCreateAllowedFields), createNewsFeedValidators, validateRequest, addManagedNewsFeed);
router.get("/news-feeds/:id", mongoIdParam("id"), validateRequest, readManagedNewsFeed);
router.patch(
  "/news-feeds/:id",
  mongoIdParam("id"),
  rejectUnknownBody(newsFeedUpdateAllowedFields),
  updateNewsFeedValidators,
  validateRequest,
  editManagedNewsFeed
);
router.delete("/news-feeds/:id", mongoIdParam("id"), validateRequest, archiveManagedNewsFeed);

export default router;
