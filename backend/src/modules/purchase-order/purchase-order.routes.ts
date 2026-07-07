import { Router } from 'express';
import purchaseOrderController from './purchase-order.controller.js';
import { authenticate, authorize } from '@middlewares/auth.js';
import { tenantIsolation } from '@middlewares/tenant.js';

const router = Router();

router.use(authenticate);
router.use(tenantIsolation);

router.post('/', authorize('SUPER_ADMIN', 'ADMIN', 'PROCUREMENT_OFFICER'), purchaseOrderController.create);
router.get('/', purchaseOrderController.list);
router.get('/stats', purchaseOrderController.getStats);
router.get('/:id', purchaseOrderController.getById);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'PROCUREMENT_OFFICER'), purchaseOrderController.update);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), purchaseOrderController.delete);

export default router;
