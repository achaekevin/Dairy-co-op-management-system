import http from 'http';
import app from './app.js';
import config from '@config/env.js';
import logger from '@core/logger.js';
import { connectDatabase, disconnectDatabase } from '@database/client.js';
import { disconnectRedis } from '@database/redis.js';
import { sessionCleanupService } from './shared/services/session-cleanup.service.js';

const server = http.createServer(app);
let cleanupInterval: NodeJS.Timeout | null = null;

const startServer = async () => {
  try {
    await connectDatabase();
    logger.info('Database connected successfully');

    cleanupInterval = sessionCleanupService.startScheduledCleanup(60);
    logger.info('Session cleanup service started (runs every 60 minutes)');

    server.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.env} mode`);
      logger.info(`API version: ${config.apiVersion}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  logger.info('Received shutdown signal, closing server gracefully...');

  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    logger.info('Session cleanup service stopped');
  }

  server.close(async () => {
    try {
      await disconnectDatabase();
      await disconnectRedis();
      logger.info('Server closed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();

export default server;
