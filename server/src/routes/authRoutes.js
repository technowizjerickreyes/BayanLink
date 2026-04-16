import express from "express";
import { login, logout, me, refresh, register } from "../controllers/authController.js";
import requireAuth from "../middleware/requireAuth.js";
import { authRateLimiter, loginRateLimiter } from "../middleware/rateLimiters.js";
import validateRequest, { rejectUnknownBody } from "../middleware/validateRequest.js";
import { citizenRegisterValidators, loginAllowedFields, loginValidators, registerAllowedFields } from "../validators/authValidators.js";

const router = express.Router();

router.post("/register", authRateLimiter, rejectUnknownBody(registerAllowedFields), citizenRegisterValidators, validateRequest, register);
router.post("/login", loginRateLimiter, rejectUnknownBody(loginAllowedFields), loginValidators, validateRequest, login);
router.post("/logout", logout);
router.post("/refresh", authRateLimiter, refresh);
router.get("/me", requireAuth, me);

export default router;
