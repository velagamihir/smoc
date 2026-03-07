import express from "express";
import { PostController } from "../controllers/postController.js";
import {
  authMiddleware,
  authorizeRoles,
  requireManager,
} from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /posts
 * List all posts with optional filters
 */
router.get(
  "/",
  authorizeRoles(["client", "manager"]),
  PostController.getAllPosts,
);

/**
 * GET /posts/:post_id
 * Get a specific post
 */
router.get("/:post_id", authorizeRoles("manager"), PostController.getPost);

/**
 * POST /posts
 * Create a new post (requires auth & manager role)
 */
router.post(
  "/",
  authorizeRoles("manager"),
  requireManager,
  PostController.createPost,
);

/**
 * PUT /posts/:post_id
 * Update a post (requires auth & manager role)
 */
router.put("/:post_id", authorizeRoles("manager"), PostController.updatePost);

export default router;
