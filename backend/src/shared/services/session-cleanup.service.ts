import prisma from '../../database/client';
import logger from '../../core/logger';

export class SessionCleanupService {
  async cleanupExpiredSessions(): Promise<void> {
    try {
      const now = new Date();

      const deletedSessions = await prisma.session.deleteMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      });

      logger.info(`Cleaned up ${deletedSessions.count} expired sessions`);
    } catch (error) {
      logger.error('Error cleaning up expired sessions:', error);
      throw error;
    }
  }

  async cleanupExpiredRefreshTokens(): Promise<void> {
    try {
      const now = new Date();

      const deletedTokens = await prisma.refreshToken.deleteMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      });

      logger.info(`Cleaned up ${deletedTokens.count} expired refresh tokens`);
    } catch (error) {
      logger.error('Error cleaning up expired refresh tokens:', error);
      throw error;
    }
  }

  async cleanupInactiveSessions(inactiveDays: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);

      const deletedSessions = await prisma.session.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      logger.info(`Cleaned up ${deletedSessions.count} inactive sessions older than ${inactiveDays} days`);
    } catch (error) {
      logger.error('Error cleaning up inactive sessions:', error);
      throw error;
    }
  }

  async cleanupAll(): Promise<void> {
    await this.cleanupExpiredSessions();
    await this.cleanupExpiredRefreshTokens();
    await this.cleanupInactiveSessions();
  }

  startScheduledCleanup(intervalMinutes: number = 60): NodeJS.Timeout {
    logger.info(`Starting session cleanup scheduler (runs every ${intervalMinutes} minutes)`);

    return setInterval(async () => {
      try {
        await this.cleanupAll();
      } catch (error) {
        logger.error('Scheduled cleanup failed:', error);
      }
    }, intervalMinutes * 60 * 1000);
  }
}

export const sessionCleanupService = new SessionCleanupService();
