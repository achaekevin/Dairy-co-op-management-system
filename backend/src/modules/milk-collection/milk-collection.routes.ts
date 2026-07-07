import { Router } from 'express';
import milkCollectionController from './milk-collection.controller.js';
import { validate } from '@middlewares/validator.js';
import { authenticate, authorize } from '@middlewares/auth.js';
import { tenantIsolation } from '@middlewares/tenant.js';
import {
  createMilkCollectionSchema,
  updateMilkCollectionSchema,
  getMilkCollectionSchema,
  deleteMilkCollectionSchema,
  listMilkCollectionsSchema,
  getStatsSchema,
  getDailySummarySchema,
  getFarmerSummarySchema,
} from './milk-collection.validation.js';

const router = Router();

router.use(authenticate);
router.use(tenantIsolation);

router.post(
  '/',
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OPERATOR'),
  validate(createMilkCollectionSchema),
  milkCollectionController.create
);

router.get(
  '/',
  validate(listMilkCollectionsSchema),
  milkCollectionController.list
);

router.get(
  '/stats',
  validate(getStatsSchema),
  milkCollectionController.getStats
);

router.get(
  '/daily-summary',
  validate(getDailySummarySchema),
  milkCollectionController.getDailySummary
);

router.get(
  '/farmer-summary',
  validate(getFarmerSummarySchema),
  milkCollectionController.getFarmerSummary
);

router.get(
  '/:id',
  validate(getMilkCollectionSchema),
  milkCollectionController.getById
);

router.put(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OPERATOR'),
  validate(updateMilkCollectionSchema),
  milkCollectionController.update
);

router.delete(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
  validate(deleteMilkCollectionSchema),
  milkCollectionController.delete
);

export default router;
