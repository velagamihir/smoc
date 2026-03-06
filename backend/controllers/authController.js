import { AuthService } from "../services/authService.js";
import { sendForgottenPasswordEmail } from "../services/emailService.js";
import { User } from "../models/User.js";

export class AuthController {
  /**
   * Handle login request
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(401).json({ error: error.message });
    }
  }

  /**
   * Handle forgotten password request
   * Generates a 6-digit OTP and sends it via email
   */
  static async forgottenPassword(req, res, next) {
    try {
      const { email } = req.body;

      // Validate email is provided
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Check if user exists in database
      const user = await User.findByEmail(email);
      if (!user) {
        // For security, don't reveal whether email exists
        return res.status(200).json({
          message:
            "If an account exists for this email, a password reset code has been sent.",
        });
      }

      // Generate 6-digit OTP
      const otp = await AuthService.generatePasswordResetOTP(email);

      // Send forgotten password email with OTP
      await sendForgottenPasswordEmail(user.full_name, email, otp);

      return res.status(200).json({
        message:
          "Password reset code sent successfully. Please check your inbox.",
        success: true,
      });
    } catch (error) {
      console.error("Error in forgottenPassword:", error);
      return res.status(500).json({
        error: "Failed to process password reset request",
        details: error.message,
      });
    }
  }

  /**
   * Handle password reset with OTP
   * Validates the OTP and updates the password
   */
  static async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword } = req.body;

      // Validate inputs
      if (!email || !otp || !newPassword) {
        return res
          .status(400)
          .json({ error: "Email, OTP, and new password are required" });
      }

      // Validate OTP format (6 digits)
      if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({
          error: "OTP must be 6 digits",
        });
      }

      // Password validation (minimum 8 characters)
      if (newPassword.length < 8) {
        return res.status(400).json({
          error: "Password must be at least 8 characters long",
        });
      }

      // Reset password using OTP
      const result = await AuthService.resetPasswordWithOTP(
        email,
        otp,
        newPassword,
      );

      return res.status(200).json({
        message: "Password reset successfully",
        success: true,
      });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      return res.status(400).json({
        error: "Password reset failed",
        details: error.message,
      });
    }
  }
}
