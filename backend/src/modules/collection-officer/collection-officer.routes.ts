import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
import {
  getDashboardStats,
  verifyFarmer,
  assessQuality,
  recordCollection,
  getReceipt,
  getCollectionHistory,
  getDailyCollectionReport,
  getFarmerCollectionHistory,
} from './collection-officer.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OPERATOR'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/verify-farmer', verifyFarmer);
router.post('/quality/assess', assessQuality);
router.post('/collections', recordCollection);
router.get('/collections/receipt/:collectionId', getReceipt);
router.get('/collections/history', getCollectionHistory);
router.get('/reports/daily', getDailyCollectionReport);
router.get('/farmers/:farmerId/history', getFarmerCollectionHistory);

export default router;
