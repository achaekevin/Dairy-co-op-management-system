import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();
const controller = new UserController();

router.use(authenticate);

router.get('/', controller.getAll);
router.delete('/:id', controller.delete);

export default router;
