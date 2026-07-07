import { Router } from 'express';
import dashboardController from './dashboard.controller.js';
import { authenticate } from '@middlewares/auth.js';
import { tenantIsolation } from '@middlewares/tenant.js';

const router = Router();

router.use(authenticate);
router.use(tenantIsolation);

router.get('/overview', dashboardController.getOverview);
router.get('/financial', dashboardController.getFinancialSummary);
router.get('/operational', dashboardController.getOperationalMetrics);
router.get('/alerts', dashboardController.getAlerts);

export default router;
