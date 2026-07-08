import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
import {
  getDashboardStats,
  generatePayments,
  approvePayment,
  makePayment,
  getFarmerStatement,
  getLoanLedger,
  getRepaymentSchedule,
  calculateInterest,
  getShareContributions,
  calculateDividends,
  getEmployeeSalaries,
  getFinancialReport,
  getCashFlowReport,
  getRevenueReport,
} from './accountant.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'));

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Payments
router.post('/payments/generate', generatePayments);
router.post('/payments/:paymentId/approve', approvePayment);
router.post('/payments/:paymentId/pay', makePayment);
router.get('/farmers/:farmerId/statement', getFarmerStatement);

// Loans
router.get('/loans/ledger', getLoanLedger);
router.get('/loans/:loanId/schedule', getRepaymentSchedule);
router.post('/loans/calculate-interest', calculateInterest);

// Shares
router.get('/shares/contributions', getShareContributions);
router.post('/shares/calculate-dividends', calculateDividends);

// Payroll
router.get('/payroll/salaries', getEmployeeSalaries);

// Reports
router.get('/reports/financial', getFinancialReport);
router.get('/reports/cash-flow', getCashFlowReport);
router.get('/reports/revenue', getRevenueReport);

export default router;
