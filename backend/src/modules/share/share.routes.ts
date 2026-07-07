import { Router } from 'express';
import shareController from './share.controller.js';
import { authenticate, authorize } from '@middlewares/auth.js';
import { tenantIsolation } from '@middlewares/tenant.js';

const router = Router();

router.use(authenticate);
router.use(tenantIsolation);

router.post('/', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), shareController.create);
router.get('/', shareController.list);
router.get('/stats', shareController.getStats);
router.get('/:id', shareController.getById);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), shareController.update);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), shareController.delete);

export default router;
