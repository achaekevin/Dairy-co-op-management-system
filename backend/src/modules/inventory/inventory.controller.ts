import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendPaginated } from '@core/response.js';
import inventoryService from './inventory.service.js';

class InventoryController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await inventoryService.createInventoryItem(req.tenantId!, req.body);
      sendCreated(res, item, 'Inventory item created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await inventoryService.getInventoryItemById(req.params.id, req.tenantId!);
      sendSuccess(res, item, 'Inventory item retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await inventoryService.updateInventoryItem(req.params.id, req.tenantId!, req.body);
      sendSuccess(res, item, 'Inventory item updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await inventoryService.deleteInventoryItem(req.params.id, req.tenantId!);
      sendSuccess(res, null, 'Inventory item deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 20, sortBy, sortOrder, ...filters } = req.query;
      const { items, total } = await inventoryService.listInventoryItems(
        req.tenantId!,
        filters,
        Number(page),
        Number(limit),
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );
      sendPaginated(res, items, Number(page), Number(limit), total);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await inventoryService.getInventoryStats(req.tenantId!);
      sendSuccess(res, stats, 'Inventory statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new InventoryController();
