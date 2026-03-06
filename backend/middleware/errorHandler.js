/**
 * Global error handling middleware
 * Should be registered last
 */
export function errorHandler(error, req, res, next) {
  console.error("Error:", error);

  // Default to 500 server error
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { details: error.stack }),
  });
}

/**
 * 404 handler
 */
export function notFoundHandler(req, res) {
  res.status(404).json({ error: "Route not found" });
}
