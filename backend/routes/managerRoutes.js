import express from "express";
import { ManagerController } from "../controllers/managerController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /manager/clients
 * Get all clients for the authenticated manager
 */
router.get("/clients", authMiddleware, ManagerController.getClients);

export default router;
