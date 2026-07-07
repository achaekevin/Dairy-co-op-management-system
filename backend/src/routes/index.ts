import { Router } from 'express';
import authRoutes from '@modules/auth/auth.routes.js';
import farmerRoutes from '@modules/farmer/farmer.routes.js';
import milkCollectionRoutes from '@modules/milk-collection/milk-collection.routes.js';
import qualityRoutes from '@modules/quality/quality.routes.js';
import paymentRoutes from '@modules/payment/payment.routes.js';
import loanRoutes from '@modules/loan/loan.routes.js';
import shareRoutes from '@modules/share/share.routes.js';
import inventoryRoutes from '@modules/inventory/inventory.routes.js';
import supplierRoutes from '@modules/supplier/supplier.routes.js';
import purchaseOrderRoutes from '@modules/purchase-order/purchase-order.routes.js';
import customerRoutes from '@modules/customer/customer.routes.js';
import vehicleRoutes from '@modules/vehicle/vehicle.routes.js';
import employeeRoutes from '@modules/employee/employee.routes.js';
import meetingRoutes from '@modules/meeting/meeting.routes.js';
import dashboardRoutes from '@modules/dashboard/dashboard.routes.js';
import superAdminRoutes from '@modules/super-admin/super-admin.routes.js';
import managerRoutes from '@modules/manager/manager.routes.js';
import collectionOfficerRoutes from '@modules/collection-officer/collection-officer.routes.js';
import accountantRoutes from '@modules/accountant/accountant.routes.js';
import config from '@config/env.js';

const router = Router();

const apiVersion = config.apiVersion;

router.use(`/api/${apiVersion}/auth`, authRoutes);
router.use(`/api/${apiVersion}/dashboard`, dashboardRoutes);
router.use(`/api/${apiVersion}/super-admin`, superAdminRoutes);
router.use(`/api/${apiVersion}/manager`, managerRoutes);
router.use(`/api/${apiVersion}/collection-officer`, collectionOfficerRoutes);
router.use(`/api/${apiVersion}/accountant`, accountantRoutes);
router.use(`/api/${apiVersion}/farmers`, farmerRoutes);
router.use(`/api/${apiVersion}/milk-collections`, milkCollectionRoutes);
router.use(`/api/${apiVersion}/quality-tests`, qualityRoutes);
router.use(`/api/${apiVersion}/payments`, paymentRoutes);
router.use(`/api/${apiVersion}/loans`, loanRoutes);
router.use(`/api/${apiVersion}/shares`, shareRoutes);
router.use(`/api/${apiVersion}/inventory`, inventoryRoutes);
router.use(`/api/${apiVersion}/suppliers`, supplierRoutes);
router.use(`/api/${apiVersion}/purchase-orders`, purchaseOrderRoutes);
router.use(`/api/${apiVersion}/customers`, customerRoutes);
router.use(`/api/${apiVersion}/vehicles`, vehicleRoutes);
router.use(`/api/${apiVersion}/employees`, employeeRoutes);
router.use(`/api/${apiVersion}/meetings`, meetingRoutes);

export default router;
