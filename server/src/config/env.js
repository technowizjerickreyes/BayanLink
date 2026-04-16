import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

function requiredSecret(name) {
  const value = process.env[name];

  if (value) {
    return value;
  }

  if (isProduction) {
    throw new Error(`${name} is required in production`);
  }

  console.warn(`${name} is not set. Using an ephemeral development secret for this process.`);
  return crypto.randomBytes(32).toString("hex");
}

function parseOrigins(value) {
  if (value) {
    return value
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);
  }

  if (isProduction) {
    return [];
  }

  return ["http://localhost:5173", "http://127.0.0.1:5173"];
}

function parseAuthCookieSameSite(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  if (normalized === "strict" || normalized === "lax" || normalized === "none") {
    return normalized;
  }

  return isProduction ? "strict" : "lax";
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction,
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "",
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS),
  authCookieSameSite: parseAuthCookieSameSite(process.env.AUTH_COOKIE_SAMESITE),
  jwtAccessSecret: requiredSecret("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: requiredSecret("JWT_REFRESH_SECRET"),
  accessTokenTtl: process.env.JWT_ACCESS_TTL || "15m",
  refreshTokenDays: Number.parseInt(process.env.REFRESH_TOKEN_DAYS || "7", 10),
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
};
