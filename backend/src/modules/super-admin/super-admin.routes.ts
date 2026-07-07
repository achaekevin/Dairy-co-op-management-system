import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
import {
  getDashboardStats,
  getSystemHealth,
  getAuditLogs,
  getLoginHistory,
  getSystemSettings,
  updateSystemSettings,
  createBackup,
  getBackups,
  restoreBackup,
} from './super-admin.controller';

const router = Router();

router.use(authenticate);
router.use(authorize(['SUPER_ADMIN', 'ADMIN']));

router.get('/dashboard/stats', getDashboardStats);
router.get('/system/health', getSystemHealth);
router.get('/audit-logs', getAuditLogs);
router.get('/login-history', getLoginHistory);
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);
router.post('/backups', createBackup);
router.get('/backups', getBackups);
router.post('/backups/:backupId/restore', restoreBackup);

export default router;
