import { Router } from 'express';
import loanController from './loan.controller.js';
import { authenticate, authorize } from '@middlewares/auth.js';
import { tenantIsolation } from '@middlewares/tenant.js';

const router = Router();

router.use(authenticate);
router.use(tenantIsolation);

router.post('/', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), loanController.create);
router.get('/', loanController.list);
router.get('/stats', loanController.getStats);
router.get('/:id', loanController.getById);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), loanController.update);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), loanController.delete);

export default router;
