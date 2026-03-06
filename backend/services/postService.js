import { v4 as uuidv4 } from "uuid";
import { Post } from "../models/Post.js";
import { BRAND_ID, ALLOWED_POST_FIELDS } from "../config/constants.js";

export class PostService {
  /**
   * Get all posts with optional filters
   */
  static async getAllPosts(filters = {}) {
    const { brand_id = BRAND_ID, month, year } = filters;
    return Post.findAll({ brand_id, month, year });
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
  static async createPost(postData) {
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
