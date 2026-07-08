import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { authorize } from '../../middlewares/auth';
import * as customerPortalController from './customer-portal.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('CUSTOMER'));

router.get('/dashboard', customerPortalController.getDashboardStats);
router.get('/products', customerPortalController.getProducts);
router.get('/products/categories', customerPortalController.getProductCategories);
router.post('/orders', customerPortalController.placeOrder);
router.get('/orders', customerPortalController.getOrderHistory);
router.get('/orders/:orderNumber/track', customerPortalController.trackOrder);
router.patch('/orders/:orderId/cancel', customerPortalController.cancelOrder);
router.post('/payments', customerPortalController.makePayment);
router.get('/payments', customerPortalController.getPaymentHistory);
router.get('/invoices/:orderId', customerPortalController.getInvoice);
router.post('/returns', customerPortalController.createReturnRequest);
router.get('/returns', customerPortalController.getReturnStatus);
router.get('/profile', customerPortalController.getProfile);
router.patch('/profile', customerPortalController.updateProfile);
router.get('/delivery-addresses', customerPortalController.getDeliveryAddresses);
router.post('/delivery-addresses', customerPortalController.saveDeliveryAddress);
router.get('/payment-methods', customerPortalController.getSavedPaymentMethods);
router.post('/payment-methods', customerPortalController.savePaymentMethod);
router.get('/notifications', customerPortalController.getNotifications);

export default router;
