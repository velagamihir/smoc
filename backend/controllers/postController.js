import { PostService } from "../services/postService.js";

export class PostController {
  /**
   * Get all posts with optional filters
   */
  static async getAllPosts(req, res, next) {
    try {
      const { brand_id, month, year, client_id } = req.query;
      const filters = {};

      if (brand_id) filters.brand_id = brand_id;
      if (month) filters.month = parseInt(month);
      if (year) filters.year = parseInt(year);
      if (client_id) filters.client_id = client_id;

      // If user is client, only show their posts
      if (req.user.role === "client") {
        filters.client_id = req.user.id;
      }

      // If user is manager, only show posts they created
      if (req.user.role === "manager") {
        filters.manager_id = req.user.id;
      }

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
      const post = await PostService.createPost(
        req.body,
        req.user.id,
        req.user.role,
      );
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
