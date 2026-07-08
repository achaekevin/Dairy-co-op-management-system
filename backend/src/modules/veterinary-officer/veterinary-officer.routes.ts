import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { authorize } from '../../middlewares/auth';
import * as veterinaryOfficerController from './veterinary-officer.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VETERINARIAN'));

router.get('/dashboard', veterinaryOfficerController.getDashboardStats);
router.post('/animals', veterinaryOfficerController.registerAnimal);
router.get('/animals/:animalId', veterinaryOfficerController.getAnimalProfile);
router.get('/animals/farmer/:farmerId', veterinaryOfficerController.getAnimalsByFarmer);
router.post('/vaccinations', veterinaryOfficerController.recordVaccination);
router.post('/treatments', veterinaryOfficerController.recordTreatment);
router.post('/diseases', veterinaryOfficerController.reportDisease);
router.post('/breeding', veterinaryOfficerController.recordBreeding);
router.post('/pregnancy', veterinaryOfficerController.recordPregnancy);
router.post('/calving', veterinaryOfficerController.recordCalving);
router.post('/farm-visits', veterinaryOfficerController.scheduleFarmVisit);
router.patch('/farm-visits/:visitId/complete', veterinaryOfficerController.completeFarmVisit);
router.get('/farm-visits', veterinaryOfficerController.getFarmVisits);
router.get('/reports/health', veterinaryOfficerController.getHealthReport);
router.get('/reports/vaccination', veterinaryOfficerController.getVaccinationReport);
router.get('/reports/disease', veterinaryOfficerController.getDiseaseStatistics);

export default router;
