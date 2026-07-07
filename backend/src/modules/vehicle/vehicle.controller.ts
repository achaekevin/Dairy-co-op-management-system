import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendPaginated } from '@core/response.js';
import vehicleService from './vehicle.service.js';

class VehicleController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.createVehicle(req.tenantId!, req.body);
      sendCreated(res, vehicle, 'Vehicle created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.getVehicleById(req.params.id, req.tenantId!);
      sendSuccess(res, vehicle, 'Vehicle retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.updateVehicle(req.params.id, req.tenantId!, req.body);
      sendSuccess(res, vehicle, 'Vehicle updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await vehicleService.deleteVehicle(req.params.id, req.tenantId!);
      sendSuccess(res, null, 'Vehicle deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 20, sortBy, sortOrder, ...filters } = req.query;
      const { vehicles, total } = await vehicleService.listVehicles(
        req.tenantId!,
        filters,
        Number(page),
        Number(limit),
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );
      sendPaginated(res, vehicles, Number(page), Number(limit), total);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await vehicleService.getVehicleStats(req.tenantId!);
      sendSuccess(res, stats, 'Vehicle statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new VehicleController();
