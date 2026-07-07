import { Router } from 'express';
import vehicleController from './vehicle.controller.js';
import { authenticate, authorize } from '@middlewares/auth.js';
import { tenantIsolation } from '@middlewares/tenant.js';

const router = Router();

router.use(authenticate);
router.use(tenantIsolation);

router.post('/', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), vehicleController.create);
router.get('/', vehicleController.list);
router.get('/stats', vehicleController.getStats);
router.get('/:id', vehicleController.getById);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), vehicleController.update);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), vehicleController.delete);

export default router;
