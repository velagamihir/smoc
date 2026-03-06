import { v4 as uuidv4 } from "uuid";
import { Comment } from "../models/Comment.js";

export class CommentService {
  /**
   * Get comments for a post
   */
  static async getComments(post_id, field_name = null) {
    return Comment.findByPostId(post_id, field_name);
  }

  /**
   * Get comment counts by field for a post
   */
  static async getCommentCounts(post_id) {
    return Comment.getCountsByPost(post_id);
  }

  /**
   * Create a new comment
   */
  static async createComment(
    post_id,
    field_name,
    content,
    user_id,
    parent_id = null,
  ) {
    const commentData = {
      id: uuidv4(),
      post_id,
      field_name,
      parent_id,
      user_id,
      content,
    };

    await Comment.create(commentData);
    return Comment.findById(commentData.id);
  }
}
