import { Router } from 'express';
import supplierController from './supplier.controller.js';
import { authenticate, authorize } from '@middlewares/auth.js';
import { tenantIsolation } from '@middlewares/tenant.js';

const router = Router();

router.use(authenticate);
router.use(tenantIsolation);

router.post('/', authorize('SUPER_ADMIN', 'ADMIN', 'PROCUREMENT_OFFICER'), supplierController.create);
router.get('/', supplierController.list);
router.get('/stats', supplierController.getStats);
router.get('/:id', supplierController.getById);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'PROCUREMENT_OFFICER'), supplierController.update);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), supplierController.delete);

export default router;
