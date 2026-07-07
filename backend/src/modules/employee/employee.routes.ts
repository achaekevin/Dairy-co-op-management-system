import { Router } from 'express';
import employeeController from './employee.controller.js';
import { authenticate, authorize } from '@middlewares/auth.js';
import { tenantIsolation } from '@middlewares/tenant.js';

const router = Router();

router.use(authenticate);
router.use(tenantIsolation);

router.post('/', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), employeeController.create);
router.get('/', employeeController.list);
router.get('/stats', employeeController.getStats);
router.get('/:id', employeeController.getById);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), employeeController.update);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), employeeController.delete);

export default router;
