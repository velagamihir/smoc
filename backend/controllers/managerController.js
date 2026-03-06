import { ManagerClient } from "../models/User.js";

export class ManagerController {
  /**
   * Get all clients for a manager
   */
  static async getClients(req, res, next) {
    try {
      const clients = await ManagerClient.findByManagerId(req.user.id);
      res.json(clients);
    } catch (error) {
      next(error);
    }
  }
}
