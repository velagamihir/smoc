import express from "express";
import { PostController } from "../controllers/postController.js";
import { authMiddleware, requireManager } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /posts
 * List all posts with optional filters
 */
router.get("/", PostController.getAllPosts);

/**
 * GET /posts/:post_id
 * Get a specific post
 */
router.get("/:post_id", PostController.getPost);

/**
 * POST /posts
 * Create a new post (requires auth & manager role)
 */
router.post("/", authMiddleware, requireManager, PostController.createPost);

/**
 * PUT /posts/:post_id
 * Update a post (requires auth & manager role)
 */
router.put(
  "/:post_id",
  authMiddleware,
  requireManager,
  PostController.updatePost,
);

export default router;
