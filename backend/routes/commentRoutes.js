import express from "express";
import { CommentController } from "../controllers/commentController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /comments
 * Get comments for a post (requires post_id query param)
 */
router.get("/", CommentController.getComments);

/**
 * GET /comments/counts
 * Get comment counts by field (requires post_id query param)
 */
router.get("/counts", CommentController.getCommentCounts);

/**
 * POST /comments
 * Create a new comment (requires auth)
 */
router.post("/", authMiddleware, CommentController.createComment);

export default router;
