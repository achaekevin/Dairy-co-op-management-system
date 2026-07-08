import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { authorize } from '../../middlewares/auth';
import * as farmerPortalController from './farmer-portal.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('FARMER'));

router.get('/dashboard', farmerPortalController.getDashboardStats);
router.get('/deliveries', farmerPortalController.getDeliveryHistory);
router.get('/milk-statement', farmerPortalController.getMilkStatement);
router.get('/receipts/:collectionId', farmerPortalController.getCollectionReceipt);
router.get('/payments', farmerPortalController.getPaymentHistory);
router.post('/loans/apply', farmerPortalController.applyForLoan);
router.get('/loans', farmerPortalController.getLoanStatus);
router.get('/loans/:loanId/repayment-schedule', farmerPortalController.getRepaymentSchedule);
router.get('/shares', farmerPortalController.getSharesOwned);
router.get('/animals', farmerPortalController.getAnimalRecords);
router.patch('/profile', farmerPortalController.updateProfile);
router.patch('/bank-details', farmerPortalController.updateBankDetails);
router.get('/notifications', farmerPortalController.getNotifications);

export default router;
