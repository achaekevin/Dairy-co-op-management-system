import { Request, Response, NextFunction } from 'express';
import { CollectionOfficerService } from './collection-officer.service';
import { sendSuccess } from '../../core/response';
import { AppError } from '../../core/errors';

const collectionOfficerService = new CollectionOfficerService();

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const stats = await collectionOfficerService.getDashboardStats(tenantId);
    sendSuccess(res, stats, 'Collection officer dashboard stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const verifyFarmer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { searchTerm } = req.query;

    if (!searchTerm) {
      throw new AppError('Search term is required', 400);
    }

    const farmer = await collectionOfficerService.verifyFarmer(tenantId, searchTerm as string);

    if (!farmer) {
      throw new AppError('Farmer not found', 404);
    }

    sendSuccess(res, farmer, 'Farmer verified successfully');
  } catch (error) {
    next(error);
  }
};

export const assessQuality = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { temperature, density, fat, snf, waterTest } = req.body;

    const assessment = await collectionOfficerService.assessQuality({
      temperature,
      density,
      fat,
      snf,
      waterTest,
    });

    sendSuccess(res, assessment, 'Quality assessed successfully');
  } catch (error) {
    next(error);
  }
};

export const recordCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.userId as string;

    const {
      farmerId,
      date,
      shift,
      quantity,
      temperature,
      density,
      fat,
      snf,
      waterTest,
      centerId,
    } = req.body;

    const receipt = await collectionOfficerService.recordCollection(tenantId, {
      farmerId,
      date: date ? new Date(date) : new Date(),
      shift,
      quantity: parseFloat(quantity),
      temperature: parseFloat(temperature),
      density: density ? parseFloat(density) : undefined,
      fat: parseFloat(fat),
      snf: parseFloat(snf),
      waterTest,
      centerId,
      collectedBy: userId,
    });

    sendSuccess(res, receipt, 'Milk collection recorded successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getReceipt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { collectionId } = req.params;

    const receipt = await collectionOfficerService.getReceipt(tenantId, collectionId);

    if (!receipt) {
      throw new AppError('Collection not found', 404);
    }

    sendSuccess(res, receipt, 'Receipt retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getCollectionHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { date, shift, page, limit } = req.query;

    const history = await collectionOfficerService.getCollectionHistory(
      tenantId,
      date ? new Date(date as string) : undefined,
      shift as 'MORNING' | 'EVENING' | undefined,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20
    );

    sendSuccess(res, history, 'Collection history retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getDailyCollectionReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tenantId = req.tenantId as string;
    const { date, shift } = req.query;

    const report = await collectionOfficerService.getDailyCollectionReport(
      tenantId,
      date ? new Date(date as string) : new Date(),
      shift as 'MORNING' | 'EVENING' | undefined
    );

    sendSuccess(res, report, 'Daily collection report retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getFarmerCollectionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tenantId = req.tenantId as string;
    const { farmerId } = req.params;
    const { startDate, endDate } = req.query;

    const history = await collectionOfficerService.getFarmerCollectionHistory(
      tenantId,
      farmerId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    if (!history) {
      throw new AppError('Farmer not found', 404);
    }

    sendSuccess(res, history, 'Farmer collection history retrieved successfully');
  } catch (error) {
    next(error);
  }
};
