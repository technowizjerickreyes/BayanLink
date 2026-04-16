import { env } from "../config/env.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { getCurrentUser, loginWithPassword, refreshSession, registerCitizen } from "../services/authService.js";
import { authCookieOptions, revokeRefreshToken } from "../services/tokenService.js";

const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000;

function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie("accessToken", accessToken, authCookieOptions(ACCESS_COOKIE_MAX_AGE));
  res.cookie(
    "refreshToken",
    refreshToken.token,
    authCookieOptions(Math.max(new Date(refreshToken.expiresAt).getTime() - Date.now(), 0))
  );
}

function clearAuthCookies(res) {
  res.clearCookie("accessToken", authCookieOptions(0));
  res.clearCookie("refreshToken", authCookieOptions(0));
}

export const register = asyncHandler(async (req, res) => {
  const user = await registerCitizen(req.validated.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Registration complete",
    data: { user },
  });
});

export const login = asyncHandler(async (req, res) => {
  const session = await loginWithPassword(req, req.validated.body);
  setAuthCookies(res, session);

  return sendSuccess(res, {
    message: "Login successful",
    data: {
      user: session.user,
      accessToken: session.accessToken,
      tokenType: "Bearer",
      expiresIn: env.accessTokenTtl,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  await revokeRefreshToken(req.cookies?.refreshToken, {
    ipAddress: req.ip || req.socket?.remoteAddress || "",
  });

  clearAuthCookies(res);

  return sendSuccess(res, {
    message: "Logout successful",
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const session = await refreshSession(req, req.cookies?.refreshToken || "");
  setAuthCookies(res, session);

  return sendSuccess(res, {
    message: "Session refreshed",
    data: {
      user: session.user,
      accessToken: session.accessToken,
      tokenType: "Bearer",
      expiresIn: env.accessTokenTtl,
    },
  });
});

export const me = asyncHandler(async (req, res) => {
  return sendSuccess(res, {
    message: "Authenticated user",
    data: { user: getCurrentUser(req.user) },
  });
});
