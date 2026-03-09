import express from "express";
import cors from "cors";
import config from "./config/index.js";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

// ─────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────
app.use(cors({ origin: config.allowedOrigins, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ─────────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────────
app.use("/", routes);

// ─────────────────────────────────────────────────────────────────
// Error Handling
// ─────────────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────
// Server Initialization
// ─────────────────────────────────────────────────────────────────
async function startServer() {
  try {
    app.listen(config.port, () => {
      console.log(`✓ Server running on http://localhost:${config.port}`);
      console.log(`✓ Environment: ${config.env}`);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
