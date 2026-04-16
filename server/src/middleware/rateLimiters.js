import rateLimit from "express-rate-limit";

const safeRateLimitResponse = {
  success: false,
  message: "Too many requests. Please try again later.",
};

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: safeRateLimitResponse,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: safeRateLimitResponse,
});

export const superAdminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 80,
  standardHeaders: true,
  legacyHeaders: false,
  message: safeRateLimitResponse,
});
