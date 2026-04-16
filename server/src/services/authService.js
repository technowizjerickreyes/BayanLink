import Municipality from "../models/Municipality.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { createAuditLog } from "./auditService.js";
import { issueRefreshToken, rotateRefreshToken, signAccessToken } from "./tokenService.js";

const MAX_FAILED_LOGINS = 5;
const LOCK_MINUTES = 15;

function serializeUser(user) {
  const source = typeof user.toJSON === "function" ? user.toJSON() : { ...user };
  delete source.passwordHash;
  delete source.failedLoginCount;
  delete source.lockUntil;
  return source;
}

function requestContext(req) {
  return {
    ipAddress: req.ip || req.socket?.remoteAddress || "",
    userAgent: req.get("user-agent") || "",
  };
}

async function auditSuperAdminLogin(req, user, actionType) {
  if (user?.role !== "super_admin") {
    return;
  }

  const previousUser = req.user;
  req.user = user;

  try {
    await createAuditLog({
      req,
      actionType,
      targetType: "auth",
      targetId: user._id,
      changedFields: [],
      oldValues: {},
      newValues: { email: user.email },
    });
  } finally {
    req.user = previousUser;
  }
}

async function registerFailedLogin(req, user) {
  if (!user) {
    return;
  }

  user.failedLoginCount = (user.failedLoginCount || 0) + 1;

  if (user.failedLoginCount >= MAX_FAILED_LOGINS) {
    user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
  }

  await user.save({ validateBeforeSave: false });
  await auditSuperAdminLogin(req, user, "failed_super_admin_login");
}

export async function registerCitizen(payload) {
  const municipality = await Municipality.findOne({
    _id: payload.municipalityId,
    status: "active",
    deletedAt: null,
  }).lean();

  if (!municipality) {
    throw new ApiError(400, "Municipality is not available for registration");
  }

  const passwordHash = await User.hashPassword(payload.password);
  const user = await User.create({
    email: payload.email,
    passwordHash,
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone || "",
    municipalityId: payload.municipalityId,
    barangayId: payload.barangayId,
    role: "citizen",
    status: "active",
  });

  return serializeUser(user);
}

export async function loginWithPassword(req, { email, password }) {
  const user = await User.findOne({ email }).select("+passwordHash +failedLoginCount +lockUntil");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.lockUntil && user.lockUntil > new Date()) {
    await auditSuperAdminLogin(req, user, "failed_super_admin_login");
    throw new ApiError(401, "Invalid credentials");
  }

  const passwordMatches = await user.comparePassword(password);

  if (!passwordMatches || user.status !== "active") {
    await registerFailedLogin(req, user);
    throw new ApiError(401, "Invalid credentials");
  }

  user.failedLoginCount = 0;
  user.lockUntil = null;
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user, requestContext(req));

  await auditSuperAdminLogin(req, user, "successful_super_admin_login");

  return {
    user: serializeUser(user),
    accessToken,
    refreshToken,
  };
}

export async function refreshSession(req, rawRefreshToken) {
  const rotated = await rotateRefreshToken(rawRefreshToken, requestContext(req));

  if (!rotated) {
    throw new ApiError(401, "Authentication required");
  }

  const user = await User.findById(rotated.userId);

  if (!user || user.status !== "active") {
    throw new ApiError(401, "Authentication required");
  }

  return {
    user: serializeUser(user),
    accessToken: signAccessToken(user),
    refreshToken: {
      token: rotated.token,
      expiresAt: rotated.expiresAt,
    },
  };
}

export function getCurrentUser(user) {
  return serializeUser(user);
}
