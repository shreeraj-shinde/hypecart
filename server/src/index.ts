import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { createServer } from "./server.js";

const app = createServer();

const server = app.listen(env.port, () => {
  logger.info(
    `listening on http://localhost:${env.port} (${env.nodeEnv})`,
  );
});

const shutdown = (signal: NodeJS.Signals): void => {
  logger.info(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
