import { Router } from 'express';
import farmerController from './farmer.controller.js';
import { validate } from '@middlewares/validator.js';
import { authenticate, authorize } from '@middlewares/auth.js';
import { tenantIsolation } from '@middlewares/tenant.js';
import {
  createFarmerSchema,
  updateFarmerSchema,
  getFarmerSchema,
  deleteFarmerSchema,
  listFarmersSchema,
} from './farmer.validation.js';

const router = Router();

router.get('/statistics', farmerController.getStats);

router.use(authenticate);
router.use(tenantIsolation);

router.post(
  '/',
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OPERATOR'),
  validate(createFarmerSchema),
  farmerController.create
);

router.get(
  '/',
  validate(listFarmersSchema),
  farmerController.list
);

router.get('/stats', farmerController.getStats);

router.get('/villages', farmerController.getVillages);

router.get('/districts', farmerController.getDistricts);

router.get(
  '/:id',
  validate(getFarmerSchema),
  farmerController.getById
);

router.put(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OPERATOR'),
  validate(updateFarmerSchema),
  farmerController.update
);

router.delete(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
  validate(deleteFarmerSchema),
  farmerController.delete
);

router.post(
  '/:id/restore',
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
  validate(getFarmerSchema),
  farmerController.restore
);

export default router;
