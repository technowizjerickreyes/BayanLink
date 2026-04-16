import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { mapUploadedAttachments } from "../services/fileUploadService.js";

export const uploadAttachments = asyncHandler(async (req, res) => {
  const files = mapUploadedAttachments(req);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Attachments uploaded",
    data: files,
  });
});
