import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendPaginated } from '@core/response.js';
import supplierService from './supplier.service.js';

class SupplierController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const supplier = await supplierService.createSupplier(req.tenantId!, req.body);
      sendCreated(res, supplier, 'Supplier created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const supplier = await supplierService.getSupplierById(req.params.id, req.tenantId!);
      sendSuccess(res, supplier, 'Supplier retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const supplier = await supplierService.updateSupplier(req.params.id, req.tenantId!, req.body);
      sendSuccess(res, supplier, 'Supplier updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await supplierService.deleteSupplier(req.params.id, req.tenantId!);
      sendSuccess(res, null, 'Supplier deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 20, sortBy, sortOrder, ...filters } = req.query;
      const { suppliers, total } = await supplierService.listSuppliers(
        req.tenantId!,
        filters,
        Number(page),
        Number(limit),
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );
      sendPaginated(res, suppliers, Number(page), Number(limit), total);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await supplierService.getSupplierStats(req.tenantId!);
      sendSuccess(res, stats, 'Supplier statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new SupplierController();
