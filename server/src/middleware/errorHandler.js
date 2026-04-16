import ApiError from "../utils/ApiError.js";

export default function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || "Server error";
  let details = err.details;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid identifier";
  }

  if (err.name === "StrictModeError") {
    statusCode = 400;
    message = "Request contains unsupported fields";
  }

  if (err.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(err.keyPattern || err.keyValue || {});
    message = `${fields[0] || "Record"} already exists`;
  }

  if (!(err instanceof ApiError) && statusCode >= 500 && process.env.NODE_ENV === "production") {
    message = "Server error";
    details = undefined;
  }

  const payload = {
    success: false,
    message,
  };

  if (details && process.env.NODE_ENV !== "production") {
    payload.details = details;
  }

  if (process.env.NODE_ENV !== "production" && statusCode >= 500) {
    payload.stack = err.stack;
  }

  return res.status(statusCode).json(payload);
}
