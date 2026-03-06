import { CommentService } from "../services/commentService.js";

export class CommentController {
  /**
   * Get comments for a post
   */
  static async getComments(req, res, next) {
    try {
      const { post_id, field_name } = req.query;

      if (!post_id) {
        return res.status(400).json({ error: "post_id is required" });
      }

      const comments = await CommentService.getComments(post_id, field_name);
      res.json(comments);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get comment counts by field
   */
  static async getCommentCounts(req, res, next) {
    try {
      const { post_id } = req.query;

      if (!post_id) {
        return res.status(400).json({ error: "post_id is required" });
      }

      const counts = await CommentService.getCommentCounts(post_id);
      res.json(counts);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new comment
   */
  static async createComment(req, res, next) {
    try {
      const { post_id, field_name, content, parent_id } = req.body;

      if (!post_id || !field_name || !content) {
        return res
          .status(400)
          .json({ error: "post_id, field_name, and content are required" });
      }

      const comment = await CommentService.createComment(
        post_id,
        field_name,
        content,
        req.user.id,
        parent_id,
      );

      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
