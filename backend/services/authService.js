import { v4 as uuidv4 } from "uuid";
import jwt from "jwt-simple";
import { User, ManagerClient } from "../models/User.js";
import { query } from "../config/database.js";
import config from "../config/index.js";

export class AuthService {
  /**
   * Authenticate user and generate JWT token using database
   */
  static async login(email, password) {
    // Find user by email in database
    const user = await User.findByEmail(email);

    if (!user || !user.is_active) {
      throw new Error("Invalid credentials");
    }

    // Verify password using pgcrypto
    const passwordMatch = await query(
      "SELECT ($1 = crypt($2, $1)) as password_match",
      [user.password_hash, password],
    );

    if (!passwordMatch.rows[0].password_match) {
      throw new Error("Invalid credentials");
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate JWT token
    const token = jwt.encode(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
    );

    const manager_clients = [];

    // If user is a manager, fetch their clients from users table
    if (user.role === "manager") {
      const clientList = await User.findClientsByManagerId(user.id);
      manager_clients.push(
        ...clientList.map((client) => ({
          id: client.id,
          manager_id: client.manager_id,
          client_id: client.id,
          client_profile: {
            id: client.id,
            full_name: client.full_name,
            email: client.email,
            role: client.role,
            created_at: client.created_at,
          },
        })),
      );
    }

    return {
      token,
      user_id: user.id,
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      manager_clients,
    };
  }

  /**
   * Generate a 6-digit OTP for password reset
   */
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate and store OTP for forgotten password
   */
  static async generatePasswordResetOTP(email) {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Store OTP in database
    await User.storeResetOTP(email, otp, expiresAt);

    return otp;
  }

  /**
   * Verify OTP for password reset
   */
  static async verifyPasswordResetOTP(email, otp) {
    const resetData = await User.verifyResetOTP(email, otp);

    if (!resetData) {
      return { valid: false, error: "Invalid or expired OTP" };
    }

    return { valid: true, email: resetData.email };
  }

  /**
   * Reset password using email and verified OTP
   */
  static async resetPasswordWithOTP(email, otp, newPassword) {
    // Verify OTP first
    const verification = await this.verifyPasswordResetOTP(email, otp);

    if (!verification.valid) {
      throw new Error(verification.error);
    }

    // Clear OTP and update password
    const result = await User.updatePasswordByEmail(email, newPassword);

    if (!result) {
      throw new Error("User not found");
    }

    return { success: true, message: "Password reset successfully" };
  }

  /**
   * Generate a password reset token for an email (legacy)
   */
  static async generatePasswordResetToken(email) {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Token expires in 1 hour

    // Store token in database
    await User.storeResetToken(email, token, expiresAt);

    return token;
  }

  /**
   * Verify a password reset token from database (legacy)
   */
  static async verifyPasswordResetToken(token) {
    const resetData = await User.verifyResetToken(token);

    if (!resetData) {
      return { valid: false, error: "Invalid or expired token" };
    }

    return { valid: true, email: resetData.email };
  }

  /**
   * Reset password using a valid reset token (legacy)
   */
  static async resetPassword(token, newPassword) {
    const verification = await this.verifyPasswordResetToken(token);

    if (!verification.valid) {
      throw new Error(verification.error);
    }

    const email = verification.email;

    // Update password using pgcrypto hash
    const result = await User.updatePasswordByEmail(email, newPassword);

    if (!result) {
      throw new Error("User not found");
    }

    return { success: true, message: "Password reset successfully" };
  }

  /**
   * Decode and verify JWT token
   */
  static verifyToken(token) {
    try {
      return jwt.decode(token, config.jwtSecret);
    } catch (error) {
      return null;
    }
  }
}
