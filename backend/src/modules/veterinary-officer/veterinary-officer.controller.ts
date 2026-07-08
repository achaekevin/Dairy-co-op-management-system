import { Request, Response, NextFunction } from 'express';
import { VeterinaryOfficerService } from './veterinary-officer.service';
import { sendSuccess } from '../../core/response';

const veterinaryOfficerService = new VeterinaryOfficerService();

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const stats = await veterinaryOfficerService.getDashboardStats(tenantId);
    sendSuccess(res, stats, 'Dashboard stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const registerAnimal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const animal = req.body;
    const result = await veterinaryOfficerService.registerAnimal(tenantId, animal);
    sendSuccess(res, result, 'Animal registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getAnimalProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { animalId } = req.params;
    const result = await veterinaryOfficerService.getAnimalProfile(tenantId, animalId);
    sendSuccess(res, result, 'Animal profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const recordVaccination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const vaccination = {
      ...req.body,
      administeredBy: req.user?.userId,
      administeredDate: new Date(),
    };
    const result = await veterinaryOfficerService.recordVaccination(tenantId, vaccination);
    sendSuccess(res, result, 'Vaccination recorded successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const recordTreatment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const treatment = {
      ...req.body,
      treatedBy: req.user?.userId,
      startDate: new Date(),
    };
    const result = await veterinaryOfficerService.recordTreatment(tenantId, treatment);
    sendSuccess(res, result, 'Treatment recorded successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const reportDisease = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const report = {
      ...req.body,
      reportedDate: new Date(),
    };
    const result = await veterinaryOfficerService.reportDisease(tenantId, report);
    sendSuccess(res, result, 'Disease reported successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const recordBreeding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const breeding = {
      ...req.body,
      breedingDate: new Date(),
    };
    const result = await veterinaryOfficerService.recordBreeding(tenantId, breeding);
    sendSuccess(res, result, 'Breeding record created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const recordPregnancy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const pregnancy = {
      ...req.body,
      confirmationDate: new Date(),
    };
    const result = await veterinaryOfficerService.recordPregnancy(tenantId, pregnancy);
    sendSuccess(res, result, 'Pregnancy record created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const recordCalving = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const calving = {
      ...req.body,
      attendedBy: req.user?.userId,
      calvingDate: new Date(),
    };
    const result = await veterinaryOfficerService.recordCalving(tenantId, calving);
    sendSuccess(res, result, 'Calving record created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const scheduleFarmVisit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const visit = {
      ...req.body,
      conductedBy: req.user?.userId,
    };
    const result = await veterinaryOfficerService.scheduleFarmVisit(tenantId, visit);
    sendSuccess(res, result, 'Farm visit scheduled successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const completeFarmVisit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { visitId } = req.params;
    const { findings, recommendations } = req.body;
    const result = await veterinaryOfficerService.completeFarmVisit(tenantId, visitId, findings, recommendations);
    sendSuccess(res, result, 'Farm visit completed successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const getHealthReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);
    const result = await veterinaryOfficerService.getHealthReport(tenantId, startDate, endDate);
    sendSuccess(res, result, 'Health report generated successfully');
  } catch (error) {
    next(error);
  }
};

export const getVaccinationReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);
    const result = await veterinaryOfficerService.getVaccinationReport(tenantId, startDate, endDate);
    sendSuccess(res, result, 'Vaccination report generated successfully');
  } catch (error) {
    next(error);
  }
};

export const getDiseaseStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);
    const result = await veterinaryOfficerService.getDiseaseStatistics(tenantId, startDate, endDate);
    sendSuccess(res, result, 'Disease statistics generated successfully');
  } catch (error) {
    next(error);
  }
};

export const getFarmVisits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string | undefined;
    const result = await veterinaryOfficerService.getFarmVisits(tenantId, page, limit, status);
    sendSuccess(res, result, 'Farm visits retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getAnimalsByFarmer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { farmerId } = req.params;
    const result = await veterinaryOfficerService.getAnimalsByFarmer(tenantId, farmerId);
    sendSuccess(res, result, 'Farmer animals retrieved successfully');
  } catch (error) {
    next(error);
  }
};
