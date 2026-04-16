import ApiError from "./ApiError.js";

export function pickFields(source, allowedFields) {
  return allowedFields.reduce((payload, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      payload[field] = source[field];
    }

    return payload;
  }, {});
}

export function assertOnlyFields(source, allowedFields, message = "Request contains unsupported fields") {
  const allowed = new Set(allowedFields);
  const received = Object.keys(source || {});
  const unsupported = received.filter((field) => !allowed.has(field));

  if (unsupported.length > 0) {
    throw new ApiError(400, message, { unsupportedFields: unsupported });
  }
}
