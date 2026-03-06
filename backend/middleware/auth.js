import jwt from "jwt-simple";
import config from "../config/index.js";

/**
 * Extract JWT token from Authorization header
 */
function getToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
  try {
    return jwt.decode(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
}

/**
 * Middleware to authenticate requests using JWT
 * Attaches user to req.user if token is valid
 */
export function authMiddleware(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  const user = verifyToken(token);

  if (!user) {
    return res
      .status(401)
      .json({ error: "Invalid or expired token — please log in again" });
  }

  req.user = user;
  next();
}

/**
 * Middleware to check if user has manager role
 */
export function requireManager(req, res, next) {
  if (!req.user || req.user.role !== "manager") {
    return res
      .status(403)
      .json({ error: "Only managers can access this resource" });
  }
  next();
}

export { verifyToken, getToken };
