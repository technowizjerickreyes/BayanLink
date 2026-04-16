import ApiError from "../utils/ApiError.js";

export default function requireBarangayScope(getBarangayId = (req) => req.params.barangayId || req.body.barangayId) {
  return function requireBarangayScopeMiddleware(req, _res, next) {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    const requestedBarangayId = String(getBarangayId(req) || "");

    if (!requestedBarangayId) {
      return next(new ApiError(400, "Barangay id is required"));
    }

    if (String(req.user.barangayId || "") !== requestedBarangayId) {
      return next(new ApiError(403, "This record is outside your barangay scope"));
    }

    return next();
  };
}
