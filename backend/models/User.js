import { query } from "../config/database.js";

export class User {
  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const result = await query(
      "SELECT id, username, email, full_name, password_hash, role, is_active, created_at, last_login FROM users WHERE email = $1",
      [email],
    );
    return result.rows[0];
  }

  /**
   * Find user by username
   */
  static async findByUsername(username) {
    const result = await query(
      "SELECT id, username, email, full_name, password_hash, role, is_active, created_at, last_login FROM users WHERE username = $1",
      [username],
    );
    return result.rows[0];
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const result = await query(
      "SELECT id, username, email, full_name, role, is_active, created_at, last_login FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0];
  }

  /**
   * Verify password using pgcrypto
   * Compares plain password with hashed password
   */
  static async verifyPassword(password, passwordHash) {
    const result = await query("SELECT ($1 = $2) as password_match", [
      password !== null ? `crypt($1, $2)` : null,
      passwordHash,
    ]);

    // Alternative using pgcrypto directly
    const verifyResult = await query(
      "SELECT ($1 = crypt($2, $1)) as password_match",
      [passwordHash, password],
    );

    return verifyResult.rows[0].password_match;
  }

  /**
   * Create a new user with hashed password
   */
  static async create(username, email, fullName, password, role = "client") {
    const result = await query(
      `INSERT INTO users (username, email, full_name, password_hash, role)
       VALUES ($1, $2, $3, crypt($4, gen_salt('bf')), $5)
       RETURNING id, username, email, full_name, role, is_active, created_at`,
      [username, email, fullName, password, role],
    );
    return result.rows[0];
  }

  /**
   * Update password with hash
   */
  static async updatePassword(userId, newPassword) {
    const result = await query(
      `UPDATE users
       SET password_hash = crypt($1, gen_salt('bf')), updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, username, email, full_name, role, updated_at`,
      [newPassword, userId],
    );
    return result.rows[0];
  }

  /**
   * Update password by email with hash
   */
  static async updatePasswordByEmail(email, newPassword) {
    const result = await query(
      `UPDATE users
       SET password_hash = crypt($1, gen_salt('bf')), 
           updated_at = CURRENT_TIMESTAMP,
           password_reset_token = NULL,
           password_reset_expires_at = NULL
       WHERE email = $2
       RETURNING id, username, email, full_name, role, updated_at`,
      [newPassword, email],
    );
    return result.rows[0];
  }

  /**
   * Store password reset OTP
   */
  static async storeResetOTP(email, otp, expiresAt) {
    const result = await query(
      `UPDATE users
       SET password_reset_token = $1, password_reset_expires_at = $2
       WHERE email = $3
       RETURNING id, email, password_reset_token, password_reset_expires_at`,
      [otp, expiresAt, email],
    );
    return result.rows[0];
  }

  /**
   * Verify reset OTP
   */
  static async verifyResetOTP(email, otp) {
    const result = await query(
      `SELECT id, email, password_reset_token
       FROM users
       WHERE email = $1
       AND password_reset_token = $2
       AND password_reset_expires_at > CURRENT_TIMESTAMP`,
      [email, otp],
    );
    return result.rows[0];
  }

  /**
   * Store password reset token (legacy, can be deprecated)
   */
  static async storeResetToken(email, token, expiresAt) {
    const result = await query(
      `UPDATE users
       SET password_reset_token = $1, password_reset_expires_at = $2
       WHERE email = $3
       RETURNING id, email, password_reset_token, password_reset_expires_at`,
      [token, expiresAt, email],
    );
    return result.rows[0];
  }

  /**
   * Verify reset token (legacy, can be deprecated)
   */
  static async verifyResetToken(token) {
    const result = await query(
      `SELECT id, email, password_reset_token, password_reset_expires_at
       FROM users
       WHERE password_reset_token = $1
       AND password_reset_expires_at > CURRENT_TIMESTAMP`,
      [token],
    );
    return result.rows[0];
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(userId) {
    const result = await query(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1 RETURNING last_login",
      [userId],
    );
    return result.rows[0];
  }

  /**
   * Clear reset token
   */
  static async clearResetToken(email) {
    const result = await query(
      `UPDATE users
       SET password_reset_token = NULL, password_reset_expires_at = NULL
       WHERE email = $1
       RETURNING email`,
      [email],
    );
    return result.rows[0];
  }
}

export class Brand {
  /**
   * Create or update a brand
   */
  static async upsert(id, name, slug) {
    const result = await query(
      "INSERT INTO brands (id, name, slug) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET name = $2, slug = $3 RETURNING *",
      [id, name, slug],
    );
    return result.rows[0];
  }

  /**
   * Find brand by ID
   */
  static async findById(id) {
    const result = await query("SELECT * FROM brands WHERE id = $1", [id]);
    return result.rows[0];
  }

  /**
   * Find all brand
   */
  static async findAll() {
    const result = await query("SELECT * FROM brands");
    return result.rows;
  }
}

export class Profile {
  /**
   * Create or update a profile
   */
  static async upsert(id, full_name, role) {
    const result = await query(
      "INSERT INTO profiles (id, full_name, role) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET full_name = $2, role = $3 RETURNING *",
      [id, full_name, role],
    );
    return result.rows[0];
  }

  /**
   * Find profile by ID
   */
  static async findById(id) {
    const result = await query("SELECT * FROM profiles WHERE id = $1", [id]);
    return result.rows[0];
  }
}

export class ManagerClient {
  /**
   * Create or update manager-client relationship
   */
  static async upsert(id, manager_id, client_id, brand_id) {
    const result = await query(
      "INSERT INTO manager_clients (id, manager_id, client_id, brand_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING *",
      [id, manager_id, client_id, brand_id],
    );
    return result.rows[0];
  }

  /**
   * Find all clients for a manager
   */
  static async findByManagerId(manager_id) {
    const result = await query(
      `SELECT mc.id, mc.manager_id, mc.client_id, mc.brand_id,
              p.full_name, p.role,
              b.id AS b_id, b.name AS b_name, b.slug AS b_slug
       FROM manager_clients mc
       JOIN profiles p ON p.id = mc.client_id
       JOIN brands b ON b.id = mc.brand_id
       WHERE mc.manager_id = $1`,
      [manager_id],
    );

    return result.rows.map((r) => ({
      id: r.id,
      manager_id: r.manager_id,
      client_id: r.client_id,
      brand_id: r.brand_id,
      client_profile: {
        id: r.client_id,
        full_name: r.full_name,
        role: r.role,
      },
      brand: {
        id: r.b_id,
        name: r.b_name,
        slug: r.b_slug,
      },
    }));
  }
}
