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

/**
 * Higher-order middleware for role-based authorization
 * If authorizedRoles is not provided or empty array, route is open (no authentication required)
 * Otherwise, validates JWT token and checks if user has one of the authorized roles
 *
 * @param {string[]} authorizedRoles - Array of roles allowed to access the route (e.g., ["admin", "manager"])
 * @returns {function} Express middleware function
 *
 * Usage:
 *   // Protected route - only managers and admins
 *   router.get('/protected', authorizeRoles(['manager', 'admin']), controller);
 *
 *   // Open route - no authentication needed
 *   router.get('/public', authorizeRoles(), controller);
 */
export function authorizeRoles(authorizedRoles = []) {
  return (req, res, next) => {
    // Normalize authorizedRoles to an array
    if (!Array.isArray(authorizedRoles)) {
      authorizedRoles = authorizedRoles ? [authorizedRoles] : [];
    }

    // If no roles specified, route is open
    if (!authorizedRoles || authorizedRoles.length === 0) {
      return next();
    }

    // If roles are specified, require authentication
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

    // Check if user's role is in authorized roles
    if (!authorizedRoles.includes(user.role)) {
      return res.status(403).json({
        error: `Access denied. Required roles: ${authorizedRoles.join(", ")}`,
      });
    }

    req.user = user;
    next();
  };
}

export { verifyToken, getToken };
