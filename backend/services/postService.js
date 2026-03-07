import { v4 as uuidv4 } from "uuid";
import { Post } from "../models/Post.js";
import { BRAND_ID, ALLOWED_POST_FIELDS } from "../config/constants.js";
import { query } from "../config/database.js";
export class PostService {
  /**
   * Get all posts with optional filters
   */
  static async getAllPosts(filters = {}) {
    const { brand_id = BRAND_ID, month, year, client_id } = filters;
    let sql = "SELECT * FROM posts WHERE brand_id = $1";
    const params = [brand_id];
    let paramIdx = 2;

    if (client_id) {
      sql += ` AND client_id = $${paramIdx}`;
      params.push(client_id);
      paramIdx++;
    }

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
  static async createPost(postData, userId) {
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
      client_id: client_id || userId, // Use provided client_id or default to userId for clients
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
