import express from "express";
import { ManagerController } from "../controllers/managerController.js";
import { ClientController } from "../controllers/clientController.js";
import { authMiddleware, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /manager/clients
 * Get all clients for the authenticated manager
 */
router.get("/clients", authorizeRoles("manager"), ClientController.getClients);

/**
 * POST /manager/clients
 * Create a new client for the authenticated manager
 */
router.post(
  "/clients",
  authorizeRoles("manager"),
  ClientController.createClient,
);

export default router;
