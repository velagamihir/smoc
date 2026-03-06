import { PostService } from "../services/postService.js";

export class PostController {
  /**
   * Get all posts with optional filters
   */
  static async getAllPosts(req, res, next) {
    try {
      const { brand_id, month, year } = req.query;
      const filters = {};

      if (brand_id) filters.brand_id = brand_id;
      if (month) filters.month = parseInt(month);
      if (year) filters.year = parseInt(year);

      const posts = await PostService.getAllPosts(filters);
      res.json(posts);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific post by ID
   */
  static async getPost(req, res, next) {
    try {
      const { post_id } = req.params;
      const post = await PostService.getPostById(post_id);
      res.json(post);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  /**
   * Create a new post
   */
  static async createPost(req, res, next) {
    try {
      const post = await PostService.createPost(req.body);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Update a post
   */
  static async updatePost(req, res, next) {
    try {
      const { post_id } = req.params;
      const post = await PostService.updatePost(post_id, req.body);
      res.json(post);
    } catch (error) {
      if (error.message === "Post not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }
}
