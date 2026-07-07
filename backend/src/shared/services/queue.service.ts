import { Queue, QueueEvents } from 'bullmq';
import config from '@config/env.js';
import logger from '@core/logger.js';

const connection = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
};

export const emailQueue = new Queue('email', { connection });

export const paymentQueue = new Queue('payment', { connection });

export const reportQueue = new Queue('report', { connection });

export const notificationQueue = new Queue('notification', { connection });

const emailQueueEvents = new QueueEvents('email', { connection });
const paymentQueueEvents = new QueueEvents('payment', { connection });
const reportQueueEvents = new QueueEvents('report', { connection });
const notificationQueueEvents = new QueueEvents('notification', { connection });

emailQueueEvents.on('completed', ({ jobId }) => {
  logger.info(`Email job ${jobId} completed`);
});

emailQueueEvents.on('failed', ({ jobId, failedReason }) => {
  logger.error(`Email job ${jobId} failed: ${failedReason}`);
});

paymentQueueEvents.on('completed', ({ jobId }) => {
  logger.info(`Payment job ${jobId} completed`);
});

paymentQueueEvents.on('failed', ({ jobId, failedReason }) => {
  logger.error(`Payment job ${jobId} failed: ${failedReason}`);
});

reportQueueEvents.on('completed', ({ jobId }) => {
  logger.info(`Report job ${jobId} completed`);
});

reportQueueEvents.on('failed', ({ jobId, failedReason }) => {
  logger.error(`Report job ${jobId} failed: ${failedReason}`);
});

notificationQueueEvents.on('completed', ({ jobId }) => {
  logger.info(`Notification job ${jobId} completed`);
});

notificationQueueEvents.on('failed', ({ jobId, failedReason }) => {
  logger.error(`Notification job ${jobId} failed: ${failedReason}`);
});

interface EmailJobData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface NotificationJobData {
  userId: string;
  tenantId: string;
  title: string;
  message: string;
  type: string;
}

class QueueService {
  async addEmailJob(data: EmailJobData, delay?: number): Promise<void> {
    await emailQueue.add('send-email', data, {
      delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    });
  }

  async addPaymentJob(data: unknown, delay?: number): Promise<void> {
    await paymentQueue.add('process-payment', data, {
      delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    });
  }

  async addReportJob(data: unknown, delay?: number): Promise<void> {
    await reportQueue.add('generate-report', data, {
      delay,
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 10000,
      },
    });
  }

  async addNotificationJob(data: NotificationJobData, delay?: number): Promise<void> {
    await notificationQueue.add('send-notification', data, {
      delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
    });
  }

  async getQueueStatus(queueName: 'email' | 'payment' | 'report' | 'notification') {
    const queueMap = {
      email: emailQueue,
      payment: paymentQueue,
      report: reportQueue,
      notification: notificationQueue,
    };

    const queue = queueMap[queueName];

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
    };
  }
}

export default new QueueService();
