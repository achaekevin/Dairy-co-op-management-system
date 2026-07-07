import { Router } from 'express';
import customerController from './customer.controller.js';
import { authenticate, authorize } from '@middlewares/auth.js';
import { tenantIsolation } from '@middlewares/tenant.js';

const router = Router();

router.use(authenticate);
router.use(tenantIsolation);

router.post('/', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), customerController.create);
router.get('/', customerController.list);
router.get('/stats', customerController.getStats);
router.get('/:id', customerController.getById);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), customerController.update);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), customerController.delete);

export default router;
