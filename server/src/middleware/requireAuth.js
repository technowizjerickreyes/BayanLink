import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

function getAccessToken(req) {
  const authorization = req.get("authorization") || "";

  if (authorization.startsWith("Bearer ")) {
    return authorization.slice(7);
  }

  return req.cookies?.accessToken || "";
}

const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = getAccessToken(req);

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, env.jwtAccessSecret);
  } catch (_error) {
    throw new ApiError(401, "Authentication required");
  }

  const user = await User.findById(decoded.sub).lean();

  if (!user || user.status !== "active") {
    throw new ApiError(401, "Authentication required");
  }

  req.user = user;
  return next();
});

export default requireAuth;
