import { Router } from 'express';
import paymentController from './payment.controller.js';
import { authenticate, authorize } from '@middlewares/auth.js';
import { tenantIsolation } from '@middlewares/tenant.js';

const router = Router();

router.use(authenticate);
router.use(tenantIsolation);

router.post('/', authorize('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'), paymentController.create);
router.get('/', paymentController.list);
router.get('/stats', paymentController.getStats);
router.get('/:id', paymentController.getById);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'), paymentController.update);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), paymentController.delete);

export default router;
