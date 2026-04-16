import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import RefreshToken from "../models/RefreshToken.js";
import { createOpaqueToken, hashToken } from "../utils/tokenHash.js";

function refreshTokenHash(token) {
  return hashToken(`${token}.${env.jwtRefreshSecret}`);
}

export function signAccessToken(user) {
  return jwt.sign(
    {
      role: user.role,
      municipalityId: user.municipalityId || null,
      barangayId: user.barangayId || "",
    },
    env.jwtAccessSecret,
    {
      expiresIn: env.accessTokenTtl,
      subject: String(user._id || user.id),
    }
  );
}

export async function issueRefreshToken(user, { ipAddress = "", userAgent = "" } = {}) {
  const token = createOpaqueToken();
  const expiresAt = new Date(Date.now() + env.refreshTokenDays * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    userId: user._id || user.id,
    tokenHash: refreshTokenHash(token),
    expiresAt,
    createdByIp: ipAddress,
    userAgent,
  });

  return { token, expiresAt };
}

export async function rotateRefreshToken(rawToken, { ipAddress = "", userAgent = "" } = {}) {
  const tokenHash = refreshTokenHash(rawToken);
  const existing = await RefreshToken.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!existing) {
    return null;
  }

  const newToken = createOpaqueToken();
  const newTokenHash = refreshTokenHash(newToken);
  const expiresAt = new Date(Date.now() + env.refreshTokenDays * 24 * 60 * 60 * 1000);

  existing.revokedAt = new Date();
  existing.revokedByIp = ipAddress;
  existing.replacedByTokenHash = newTokenHash;
  await existing.save();

  await RefreshToken.create({
    userId: existing.userId,
    tokenHash: newTokenHash,
    expiresAt,
    createdByIp: ipAddress,
    userAgent,
  });

  return { userId: existing.userId, token: newToken, expiresAt };
}

export async function revokeRefreshToken(rawToken, { ipAddress = "" } = {}) {
  if (!rawToken) {
    return;
  }

  await RefreshToken.updateOne(
    {
      tokenHash: refreshTokenHash(rawToken),
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
        revokedByIp: ipAddress,
      },
    }
  );
}

export function authCookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.authCookieSameSite,
    domain: env.cookieDomain,
    path: "/",
    maxAge,
  };
}
