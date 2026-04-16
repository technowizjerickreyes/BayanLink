import express from "express";
import { uploadAttachments } from "../controllers/uploadController.js";
import requireAuth from "../middleware/requireAuth.js";
import requireRole from "../middleware/requireRole.js";
import { attachmentUpload } from "../services/fileUploadService.js";

const router = express.Router();

router.post("/attachments", requireAuth, requireRole("citizen", "municipal_admin", "barangay_admin"), attachmentUpload, uploadAttachments);

export default router;
