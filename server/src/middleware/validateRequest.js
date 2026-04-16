import { matchedData, validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

export function rejectUnknownBody(allowedFields) {
  return function rejectUnknownBodyMiddleware(req, _res, next) {
    const allowed = new Set(allowedFields);
    const unsupportedFields = Object.keys(req.body || {}).filter((field) => !allowed.has(field));

    if (unsupportedFields.length > 0) {
      return next(new ApiError(400, "Request contains unsupported fields", { unsupportedFields }));
    }

    return next();
  };
}

export default function validateRequest(req, _res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return next(
      new ApiError(400, "Validation failed", {
        errors: result.array().map((error) => ({
          field: error.path,
          message: error.msg,
        })),
      })
    );
  }

  req.validated = {
    body: matchedData(req, { locations: ["body"], includeOptionals: true }),
    query: matchedData(req, { locations: ["query"], includeOptionals: true }),
    params: matchedData(req, { locations: ["params"], includeOptionals: true }),
  };

  return next();
}
