import express from "express";
import { AuthController } from "../controllers/authController.js";

const router = express.Router();

/**
 * POST /auth/login
 * Login with email and password
 * Body: { email: string, password: string }
 */
router.post("/login", AuthController.login);

/**
 * POST /auth/forgotten-password
 * Request a password reset OTP
 * Generates a 6-digit OTP and sends it via email
 * Body: { email: string }
 * Response: { message: string, success: boolean }
 */
router.post("/forgotten-password", AuthController.forgottenPassword);

/**
 * POST /auth/reset-password
 * Reset password using email and OTP
 * Validates the OTP (6-digit code from email) and updates password
 * Body: { email: string, otp: string, newPassword: string }
 * Response: { message: string, success: boolean }
 *
 * OTP expires after 10 minutes
 * Password must be at least 8 characters
 */
router.post("/reset-password", AuthController.resetPassword);
router.post('/change-password', AuthController.changePassword);

export default router;
