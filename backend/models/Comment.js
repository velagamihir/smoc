import { query } from "../config/database.js";

export class Comment {
  /**
   * Find comments by post_id with optional field filter
   */
  static async findByPostId(post_id, field_name = null) {
    let sql = `
      SELECT c.*, p.full_name, p.role
      FROM comments c
      JOIN profiles p ON p.id = c.user_id
      WHERE c.post_id = $1
    `;
    const params = [post_id];
    let paramIdx = 2;

    if (field_name) {
      sql += ` AND c.field_name = $${paramIdx}`;
      params.push(field_name);
      paramIdx++;
    }

    sql += " ORDER BY c.created_at";
    const result = await query(sql, params);

    return result.rows.map((row) => this.formatComment(row));
  }

  /**
   * Get comment counts by field for a post
   */
  static async getCountsByPost(post_id) {
    const result = await query(
      "SELECT field_name, COUNT(*) as cnt FROM comments WHERE post_id = $1 GROUP BY field_name",
      [post_id],
    );

    const counts = {};
    result.rows.forEach((r) => {
      counts[r.field_name] = parseInt(r.cnt);
    });
    return counts;
  }

  /**
   * Create a new comment
   */
  static async create(commentData) {
    const { id, post_id, field_name, parent_id, user_id, content } =
      commentData;

    const result = await query(
      "INSERT INTO comments (id, post_id, field_name, parent_id, user_id, content) VALUES ($1, $2, $3, $4, $5, $6)",
      [id, post_id, field_name, parent_id || null, user_id, content],
    );

    return result.rows[0];
  }

  /**
   * Find comment by ID with user profile
   */
  static async findById(id) {
    const result = await query(
      `SELECT c.*, p.full_name, p.role
       FROM comments c
       JOIN profiles p ON p.id = c.user_id
       WHERE c.id = $1`,
      [id],
    );

    if (result.rows.length === 0) return null;
    return this.formatComment(result.rows[0]);
  }

  /**
   * Format comment row with profile data
   */
  static formatComment(row) {
    return {
      id: row.id,
      post_id: row.post_id,
      field_name: row.field_name,
      parent_id: row.parent_id,
      user_id: row.user_id,
      content: row.content,
      created_at: row.created_at,
      profile: {
        id: row.user_id,
        full_name: row.full_name,
        role: row.role,
      },
    };
  }
}
