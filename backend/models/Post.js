import { query } from "../config/database.js";

export class Post {
  /**
   * List all posts with optional filters
   */
  static async findAll(filters = {}) {
    const { brand_id, month, year } = filters;
    let sql = "SELECT * FROM posts WHERE brand_id = $1";
    const params = [brand_id];
    let paramIdx = 2;

    if (month && year) {
      const fromDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : year;
      const toDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

      sql += ` AND post_date >= $${paramIdx} AND post_date < $${paramIdx + 1}`;
      params.push(fromDate, toDate);
      paramIdx += 2;
    }

    sql += " ORDER BY post_date";
    const result = await query(sql, params);
    return result.rows;
  }

  /**
   * Find post by ID
   */
  static async findById(id) {
    const result = await query("SELECT * FROM posts WHERE id = $1", [id]);
    return result.rows[0];
  }

  /**
   * Create a new post
   */
  static async create(postData) {
    const {
      id,
      brand_id,
      post_date,
      day_of_week,
      content_bucket,
      format_label,
      format_type,
      format_variant,
      slide_count,
      headline,
      body_copy,
      visual_brief,
      caption,
      creative_link,
      creative,
      status,
    } = postData;

    const result = await query(
      `INSERT INTO posts
       (id, brand_id, post_date, day_of_week, content_bucket,
        format_label, format_type, format_variant, slide_count,
        headline, body_copy, visual_brief, caption, creative_link, creative, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING *`,
      [
        id,
        brand_id,
        post_date,
        day_of_week,
        content_bucket,
        format_label,
        format_type,
        format_variant,
        slide_count,
        headline,
        body_copy,
        visual_brief,
        caption,
        creative_link,
        creative,
        status,
      ],
    );

    return result.rows[0];
  }

  /**
   * Update a post
   */
  static async update(id, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
    values.push(id);

    const result = await query(
      `UPDATE posts SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1} RETURNING *`,
      values,
    );

    return result.rows[0];
  }

  /**
   * Count posts
   */
  static async count(brand_id) {
    const result = await query(
      "SELECT COUNT(*) FROM posts WHERE brand_id = $1",
      [brand_id],
    );
    return parseInt(result.rows[0].count);
  }
}
