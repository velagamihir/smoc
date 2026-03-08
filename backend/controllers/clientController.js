import { User } from "../models/User.js";
import { sendClientCredentialsEmail } from "../services/emailService.js";
import crypto from "crypto";

export class ClientController {
  /**
   * Create a new client account and send credentials via email
   * Only managers can create clients
   */
  static async createClient(req, res, next) {
    try {
      const { email, full_name, username } = req.body;
      const managerId = req.user.id; // Get manager ID from authenticated user

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

      // Create the client user with manager_id
      const newClient = await User.create(
        username,
        email,
        full_name,
        temporaryPassword,
        "client",
        managerId, // Pass manager ID
      );

      // Send credentials email
      try {
        await sendClientCredentialsEmail(
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
            "Client created successfully but failed to send email. Send password separately.",
          client: {
            id: newClient.id,
            email: newClient.email,
            username: newClient.username,
            full_name: newClient.full_name,
            role: newClient.role,
            manager_id: newClient.manager_id,
            created_at: newClient.created_at,
          },
        });
      }

      // Success response
      res.status(201).json({
        success: true,
        message: "Client created successfully and credentials sent to email",
        client: {
          id: newClient.id,
          email: newClient.email,
          username: newClient.username,
          full_name: newClient.full_name,
          role: newClient.role,
          manager_id: newClient.manager_id,
          created_at: newClient.created_at,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all clients for the authenticated manager
   */
  static async getClients(req, res, next) {
    try {
      const managerId = req.user.id;
      const clients = await User.findClientsByManagerId(managerId);
      res.json({
        success: true,
        clients,
      });
    } catch (error) {
      next(error);
    }
  }
}
