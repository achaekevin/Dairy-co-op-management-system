import { Router } from 'express';
import meetingController from './meeting.controller.js';
import { authenticate, authorize } from '@middlewares/auth.js';
import { tenantIsolation } from '@middlewares/tenant.js';

const router = Router();

router.use(authenticate);
router.use(tenantIsolation);

router.post('/', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), meetingController.create);
router.get('/', meetingController.list);
router.get('/stats', meetingController.getStats);
router.get('/:id', meetingController.getById);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), meetingController.update);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), meetingController.delete);

export default router;
