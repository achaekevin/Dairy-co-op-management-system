import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendPaginated } from '@core/response.js';
import farmerService from './farmer.service.js';
import {
  CreateFarmerData,
  UpdateFarmerData,
  FarmerFilters,
} from './farmer.types.js';

class FarmerController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantId!;
      const data: CreateFarmerData = req.body;

      const farmer = await farmerService.createFarmer(tenantId, data);

      sendCreated(res, farmer, 'Farmer created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId!;

      const farmer = await farmerService.getFarmerById(id, tenantId);

      sendSuccess(res, farmer, 'Farmer retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId!;
      const data: UpdateFarmerData = req.body;

      const farmer = await farmerService.updateFarmer(id, tenantId, data);

      sendSuccess(res, farmer, 'Farmer updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId!;

      await farmerService.deleteFarmer(id, tenantId);

      sendSuccess(res, null, 'Farmer deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async restore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId!;

      const farmer = await farmerService.restoreFarmer(id, tenantId);

      sendSuccess(res, farmer, 'Farmer restored successfully');
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
        search,
        status,
        village,
        district,
        minCattle,
        maxCattle,
        hasOutstandingLoan,
      } = req.query;

      const filters: FarmerFilters = {
        search: search as string,
        status: status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
        village: village as string,
        district: district as string,
        minCattle: minCattle ? Number(minCattle) : undefined,
        maxCattle: maxCattle ? Number(maxCattle) : undefined,
        hasOutstandingLoan: hasOutstandingLoan === 'true' ? true : hasOutstandingLoan === 'false' ? false : undefined,
      };

      const { farmers, total } = await farmerService.listFarmers(
        tenantId,
        filters,
        Number(page),
        Number(limit),
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );

      sendPaginated(res, farmers, Number(page), Number(limit), total, 'Farmers retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantId || process.env.DEFAULT_TENANT_ID || 'e7c348b9-5ab7-406a-871d-b9e80c23e548';

      const stats = await farmerService.getFarmerStats(tenantId);

      sendSuccess(res, stats, 'Farmer statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getVillages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantId!;

      const villages = await farmerService.getVillages(tenantId);

      sendSuccess(res, villages, 'Villages retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getDistricts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantId!;

      const districts = await farmerService.getDistricts(tenantId);

      sendSuccess(res, districts, 'Districts retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new FarmerController();
