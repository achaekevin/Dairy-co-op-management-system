import { Router } from 'express';
import inventoryController from './inventory.controller.js';
import { authenticate, authorize } from '@middlewares/auth.js';
import { tenantIsolation } from '@middlewares/tenant.js';

const router = Router();

router.use(authenticate);
router.use(tenantIsolation);

router.post('/', authorize('SUPER_ADMIN', 'ADMIN', 'STORE_MANAGER'), inventoryController.create);
router.get('/', inventoryController.list);
router.get('/stats', inventoryController.getStats);
router.get('/:id', inventoryController.getById);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'STORE_MANAGER'), inventoryController.update);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), inventoryController.delete);

export default router;
