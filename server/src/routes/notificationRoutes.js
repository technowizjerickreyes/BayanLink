import express from "express";
import { browseNotifications, readAllNotifications, readNotification } from "../controllers/notificationController.js";
import validateRequest from "../middleware/validateRequest.js";
import { notificationIdValidator, notificationListValidators } from "../validators/notificationValidators.js";

const router = express.Router();

router.get("/", notificationListValidators, validateRequest, browseNotifications);
router.patch("/read-all", readAllNotifications);
router.patch("/:id/read", notificationIdValidator, validateRequest, readNotification);

export default router;
