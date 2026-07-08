import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
import {
  getDashboardStats,
  getFarmerPerformance,
  getCollectionSummary,
  getCollectionCenters,
  getPendingLoans,
  approveLoan,
  rejectLoan,
  getShareTransactions,
  getDividendInfo,
  getStaff,
  getDailyReport,
} from './manager.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/farmers/performance', getFarmerPerformance);
router.get('/collections/summary', getCollectionSummary);
router.get('/collections/centers', getCollectionCenters);
router.get('/loans/pending', getPendingLoans);
router.post('/loans/:loanId/approve', approveLoan);
router.post('/loans/:loanId/reject', rejectLoan);
router.get('/shares/transactions', getShareTransactions);
router.get('/shares/dividends', getDividendInfo);
router.get('/staff', getStaff);
router.get('/reports/daily', getDailyReport);

export default router;
