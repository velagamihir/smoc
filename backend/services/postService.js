import { v4 as uuidv4 } from "uuid";
import { Post } from "../models/Post.js";
import { query } from "../config/database.js";
export class PostService {
  /**
   * Get all posts with optional filters
   */
  static async getAllPosts(filters = {}) {
    const { client_id, month, year } = filters;

    if (!client_id) {
      throw new Error("client_id is required");
    }

    let sql = "SELECT * FROM posts WHERE client_id = $1";
    const params = [client_id];
    let paramIdx = 2;

    if (month && year) {
      const fromDate = `${year}-${String(month).padStart(2, "0")}-01`;

      const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : year;

      const toDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

      sql += ` AND post_date >= $${paramIdx} AND post_date < $${paramIdx + 1}`;
      params.push(fromDate, toDate);
    }

    sql += " ORDER BY post_date";

    const result = await query(sql, params);
    return result.rows;
  }

  /**
   * Get a single post by ID
   */
  static async getPostById(id) {
    const post = await Post.findById(id);
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  }

  /**
   * Create a new post
   */
  static async createPost(postData, userId, userRole) {
    const {
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
      status = "draft",
      brand_id = BRAND_ID,
      client_id,
    } = postData;

    const newPost = {
      id: uuidv4(),
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
      client_id: client_id || (userRole === "client" ? userId : null),
      manager_id: userRole === "manager" ? userId : null,
    };

    return Post.create(newPost);
  }

  /**
   * Update a post
   */
  static async updatePost(id, updateData) {
    // Only allow specific fields to be updated
    const filteredData = {};
    Object.keys(updateData).forEach((key) => {
      if (ALLOWED_POST_FIELDS.includes(key) && updateData[key] !== undefined) {
        filteredData[key] = updateData[key];
      }
    });

    if (Object.keys(filteredData).length === 0) {
      throw new Error("No valid fields to update");
    }

    const updated = await Post.update(id, filteredData);
    if (!updated) {
      throw new Error("Post not found");
    }
    return updated;
  }
}
