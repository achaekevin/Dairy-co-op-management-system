import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { authorize } from '../../middlewares/auth';
import * as storeOfficerController from './store-officer.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STORE_MANAGER'));

router.get('/dashboard', storeOfficerController.getDashboardStats);
router.get('/stock-levels', storeOfficerController.getStockLevels);
router.post('/adjust-stock', storeOfficerController.adjustStock);
router.post('/transfer-stock', storeOfficerController.transferStock);
router.post('/feed-sale', storeOfficerController.recordFeedSale);
router.get('/suppliers', storeOfficerController.getSuppliers);
router.post('/purchase-request', storeOfficerController.createPurchaseRequest);
router.post('/receive-goods', storeOfficerController.receiveGoods);
router.get('/warehouse-inventory', storeOfficerController.getWarehouseInventory);
router.post('/damaged-stock', storeOfficerController.reportDamagedStock);
router.get('/reports/inventory', storeOfficerController.getInventoryReport);
router.get('/reports/purchase', storeOfficerController.getPurchaseReport);
router.get('/reports/supplier', storeOfficerController.getSupplierReport);

export default router;
