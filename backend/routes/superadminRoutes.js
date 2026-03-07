import express from "express";
import { SuperAdminController } from "../controllers/superadminController.js";
import { authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /superadmin/managers
 * Create a new manager account
 * Only accessible to super_admin role
 * Body: { email, full_name, username }
 */
router.post(
  "/managers",
  authorizeRoles("super_admin"),
  SuperAdminController.createManager,
);

export default router;
