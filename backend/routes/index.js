import express from "express";
import authRoutes from "./authRoutes.js";
import postRoutes from "./postRoutes.js";
import commentRoutes from "./commentRoutes.js";
import managerRoutes from "./managerRoutes.js";

const router = express.Router();

/**
 * Mount all route modules
 */
router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/manager", managerRoutes);

/**
 * Health check endpoint
 */
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
