import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendPaginated } from '@core/response.js';
import milkCollectionService from './milk-collection.service.js';
import {
  CreateMilkCollectionData,
  UpdateMilkCollectionData,
  MilkCollectionFilters,
} from './milk-collection.types.js';

class MilkCollectionController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantId!;
      const data: CreateMilkCollectionData = {
        ...req.body,
        date: new Date(req.body.date),
      };

      const collection = await milkCollectionService.createMilkCollection(tenantId, data);

      sendCreated(res, collection, 'Milk collection recorded successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId!;

      const collection = await milkCollectionService.getMilkCollectionById(id, tenantId);

      sendSuccess(res, collection, 'Milk collection retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId!;
      const data: UpdateMilkCollectionData = req.body;

      const collection = await milkCollectionService.updateMilkCollection(id, tenantId, data);

      sendSuccess(res, collection, 'Milk collection updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId!;

      await milkCollectionService.deleteMilkCollection(id, tenantId);

      sendSuccess(res, null, 'Milk collection deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantId!;
      const {
        page = 1,
        limit = 20,
        sortBy,
        sortOrder,
        farmerId,
        status,
        quality,
        shift,
        startDate,
        endDate,
        centerId,
        collectedBy,
        minQuantity,
        maxQuantity,
      } = req.query;

      const filters: MilkCollectionFilters = {
        farmerId: farmerId as string,
        status: status as 'ACCEPTED' | 'REJECTED',
        quality: quality as 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR',
        shift: shift as 'MORNING' | 'EVENING',
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        centerId: centerId as string,
        collectedBy: collectedBy as string,
        minQuantity: minQuantity ? Number(minQuantity) : undefined,
        maxQuantity: maxQuantity ? Number(maxQuantity) : undefined,
      };

      const { collections, total } = await milkCollectionService.listMilkCollections(
        tenantId,
        filters,
        Number(page),
        Number(limit),
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );

      sendPaginated(
        res,
        collections,
        Number(page),
        Number(limit),
        total,
        'Milk collections retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantId!;
      const { startDate, endDate } = req.query;

      const stats = await milkCollectionService.getMilkCollectionStats(
        tenantId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      sendSuccess(res, stats, 'Milk collection statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getDailySummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantId!;
      const { startDate, endDate } = req.query;

      const summary = await milkCollectionService.getDailySummary(
        tenantId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      sendSuccess(res, summary, 'Daily summary retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getFarmerSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantId!;
      const { startDate, endDate } = req.query;

      const summary = await milkCollectionService.getFarmerSummary(
        tenantId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      sendSuccess(res, summary, 'Farmer summary retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new MilkCollectionController();
