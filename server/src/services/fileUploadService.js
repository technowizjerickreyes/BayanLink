import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import ApiError from "../utils/ApiError.js";
import { assertOnlyFields } from "../utils/fieldWhitelist.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, "../..");
const uploadsRoot = path.resolve(serverRoot, process.env.UPLOAD_DIR || "uploads");
const attachmentsRoot = path.resolve(uploadsRoot, "attachments");
const uploadMaxFileSizeBytes = Number.parseInt(process.env.UPLOAD_MAX_FILE_SIZE_MB || "5", 10) * 1024 * 1024;

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

fs.mkdirSync(attachmentsRoot, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination(_req, _file, callback) {
      callback(null, attachmentsRoot);
    },
    filename(_req, file, callback) {
      const extension = path.extname(file.originalname || "").toLowerCase();
      callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
    },
  }),
  limits: {
    fileSize: uploadMaxFileSizeBytes,
    files: 5,
  },
  fileFilter(_req, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new ApiError(400, "Unsupported file type"));
      return;
    }

    callback(null, true);
  },
});

function mapUploadError(error) {
  if (!error) {
    return null;
  }

  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return new ApiError(400, `File size exceeds the ${Number.parseInt(process.env.UPLOAD_MAX_FILE_SIZE_MB || "5", 10)} MB limit`);
    }

    return new ApiError(400, "Attachment upload failed");
  }

  return error;
}

export function getUploadsRootDirectory() {
  return uploadsRoot;
}

export function attachmentUpload(req, res, next) {
  upload.array("files", 5)(req, res, (error) => next(mapUploadError(error)));
}

export function mapUploadedAttachments(req) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  return (req.files || []).map((file) => ({
    originalName: file.originalname,
    fileName: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    url: `${baseUrl}/${path.posix.join(path.basename(uploadsRoot), "attachments", file.filename)}`,
    uploadedAt: new Date(),
  }));
}

export function normalizeAttachments(attachments = []) {
  if (!Array.isArray(attachments)) {
    throw new ApiError(400, "Attachments must be an array");
  }

  return attachments.map((attachment) => {
    assertOnlyFields(attachment, ["originalName", "fileName", "mimeType", "size", "url", "uploadedAt"]);

    if (!attachment.originalName || !attachment.fileName || !attachment.mimeType || !attachment.url) {
      throw new ApiError(400, "Attachment metadata is incomplete");
    }

    if (!Number.isFinite(Number(attachment.size)) || Number(attachment.size) <= 0) {
      throw new ApiError(400, "Attachment size is invalid");
    }

    return {
      originalName: String(attachment.originalName).trim(),
      fileName: String(attachment.fileName).trim(),
      mimeType: String(attachment.mimeType).trim(),
      size: Number(attachment.size),
      url: String(attachment.url).trim(),
      uploadedAt: attachment.uploadedAt ? new Date(attachment.uploadedAt) : new Date(),
    };
  });
}
