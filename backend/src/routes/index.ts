import { Router } from 'express';
import authRoutes from '@modules/auth/auth.routes.js';
import farmerRoutes from '@modules/farmer/farmer.routes.js';
import milkCollectionRoutes from '@modules/milk-collection/milk-collection.routes.js';
import qualityRoutes from '@modules/quality/quality.routes.js';
import config from '@config/env.js';

const router = Router();

const apiVersion = config.apiVersion;

router.use(`/api/${apiVersion}/auth`, authRoutes);
router.use(`/api/${apiVersion}/farmers`, farmerRoutes);
router.use(`/api/${apiVersion}/milk-collections`, milkCollectionRoutes);
router.use(`/api/${apiVersion}/quality-tests`, qualityRoutes);

export default router;
