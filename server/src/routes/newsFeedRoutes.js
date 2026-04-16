import express from "express";
import {
  addManagedNewsFeed,
  archiveManagedNewsFeed,
  browseVisibleNewsFeeds,
  editManagedNewsFeed,
  readVisibleNewsFeed,
} from "../controllers/newsFeedController.js";
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

router.use(requireAuth);

router.get("/", newsFeedListValidators, validateRequest, browseVisibleNewsFeeds);
router.post(
  "/",
  requireRole("municipal_admin", "barangay_admin"),
  rejectUnknownBody(newsFeedCreateAllowedFields),
  createNewsFeedValidators,
  validateRequest,
  addManagedNewsFeed
);
router.get("/:id", mongoIdParam("id"), validateRequest, readVisibleNewsFeed);
router.patch(
  "/:id",
  requireRole("municipal_admin", "barangay_admin"),
  mongoIdParam("id"),
  rejectUnknownBody(newsFeedUpdateAllowedFields),
  updateNewsFeedValidators,
  validateRequest,
  editManagedNewsFeed
);
router.delete("/:id", requireRole("municipal_admin", "barangay_admin"), mongoIdParam("id"), validateRequest, archiveManagedNewsFeed);

export default router;
