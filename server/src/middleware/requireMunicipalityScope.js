import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

export default function requireMunicipalityScope(getMunicipalityId = (req) => req.params.municipalityId || req.body.municipalityId) {
  return function requireMunicipalityScopeMiddleware(req, _res, next) {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    const requestedMunicipalityId = String(getMunicipalityId(req) || "");

    if (!mongoose.Types.ObjectId.isValid(requestedMunicipalityId)) {
      return next(new ApiError(400, "Invalid municipality id"));
    }

    if (String(req.user.municipalityId || "") !== requestedMunicipalityId) {
      return next(new ApiError(403, "This record is outside your municipality scope"));
    }

    return next();
  };
}
