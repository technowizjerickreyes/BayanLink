export function sendSuccess(res, { statusCode = 200, message = "OK", data = null, meta = undefined } = {}) {
  const payload = { success: true, message };

  if (data !== null) {
    payload.data = data;
  }

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
}
