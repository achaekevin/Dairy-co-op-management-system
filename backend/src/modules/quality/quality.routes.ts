import { Router } from 'express';
import qualityController from './quality.controller.js';
import { validate } from '@middlewares/validator.js';
import { authenticate, authorize } from '@middlewares/auth.js';
import { tenantIsolation } from '@middlewares/tenant.js';
import {
  createQualityTestSchema,
  updateQualityTestSchema,
  getQualityTestSchema,
  deleteQualityTestSchema,
  listQualityTestsSchema,
  approveTestSchema,
  getStatsSchema,
} from './quality.validation.js';

const router = Router();

router.use(authenticate);
router.use(tenantIsolation);

router.post(
  '/',
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'LAB_TECHNICIAN', 'QUALITY_OFFICER'),
  validate(createQualityTestSchema),
  qualityController.create
);

router.get(
  '/',
  validate(listQualityTestsSchema),
  qualityController.list
);

router.get(
  '/stats',
  validate(getStatsSchema),
  qualityController.getStats
);

router.get(
  '/:id',
  validate(getQualityTestSchema),
  qualityController.getById
);

router.put(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'LAB_TECHNICIAN', 'QUALITY_OFFICER'),
  validate(updateQualityTestSchema),
  qualityController.update
);

router.post(
  '/:id/approve',
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'QUALITY_OFFICER'),
  validate(approveTestSchema),
  qualityController.approve
);

router.delete(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
  validate(deleteQualityTestSchema),
  qualityController.delete
);

export default router;
