import express from "express";
import { citizenDashboard, readProfile } from "../controllers/citizenController.js";
import { trackCitizenRequest } from "../controllers/documentRequestController.js";
import { browseVisibleNewsFeeds, readVisibleNewsFeed } from "../controllers/newsFeedController.js";
import { citizenAppointmentRouter } from "./appointmentRoutes.js";
import { citizenComplaintRouter } from "./complaintReportRoutes.js";
import { citizenDocumentRequestRouter } from "./documentRequestRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import requireAuth from "../middleware/requireAuth.js";
import requireRole from "../middleware/requireRole.js";
import validateRequest from "../middleware/validateRequest.js";
import { mongoIdParam } from "../validators/commonValidators.js";
import { trackingNumberParamValidator } from "../validators/documentRequestValidators.js";
import { newsFeedListValidators } from "../validators/newsFeedValidators.js";

const router = express.Router();

router.use(requireAuth, requireRole("citizen"));

router.get("/dashboard", citizenDashboard);
router.get("/profile", readProfile);
router.get("/news-feed", newsFeedListValidators, validateRequest, browseVisibleNewsFeeds);
router.get("/news-feed/:id", mongoIdParam("id"), validateRequest, readVisibleNewsFeed);
router.use("/document-requests", citizenDocumentRequestRouter);
router.get("/request-tracking/:trackingNumber", trackingNumberParamValidator, validateRequest, trackCitizenRequest);
router.use("/appointments", citizenAppointmentRouter);
router.use("/complaints", citizenComplaintRouter);
router.use("/notifications", notificationRoutes);

export default router;
