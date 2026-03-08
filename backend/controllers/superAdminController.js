import { User } from "../models/User.js";
import { sendManagerCredentialsEmail } from "../services/emailService.js";
import crypto from "crypto";

export class SuperAdminController {
  /**
   * Create a new manager account and send credentials via email
   * Only accessible to super_admin role
   */
  static async createManager(req, res, next) {
    try {
      const { email, full_name, username } = req.body;

      // Validate required fields
      if (!email || !full_name || !username) {
        return res.status(400).json({
          error: "Missing required fields: email, full_name, username",
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: "User with this email already exists",
        });
      }

      // Check if username already exists
      const existingUsername = await User.findByUsername(username);
      if (existingUsername) {
        return res.status(409).json({
          error: "Username already exists",
        });
      }

      // Generate a temporary password
      const temporaryPassword = crypto.randomBytes(8).toString("hex");

      // Create the manager user
      const newManager = await User.create(
        username,
        email,
        full_name,
        temporaryPassword,
        "manager",
      );

      // Send credentials email
      try {
        await sendManagerCredentialsEmail(
          full_name,
          email,
          username,
          temporaryPassword,
        );
      } catch (emailError) {
        console.error("Failed to send credentials email:", emailError);
        // Continue despite email failure, but inform the user
        return res.status(201).json({
          success: true,
          message:
            "Manager created successfully but failed to send email. Send password separately.",
          manager: {
            id: newManager.id,
            email: newManager.email,
            username: newManager.username,
            full_name: newManager.full_name,
            role: newManager.role,
            created_at: newManager.created_at,
          },
        });
      }

      // Success response
      res.status(201).json({
        success: true,
        message: "Manager created successfully and credentials sent to email",
        manager: {
          id: newManager.id,
          email: newManager.email,
          username: newManager.username,
          full_name: newManager.full_name,
          role: newManager.role,
          created_at: newManager.created_at,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
