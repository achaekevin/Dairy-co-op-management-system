import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendPaginated } from '@core/response.js';
import purchaseOrderService from './purchase-order.service.js';

class PurchaseOrderController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const po = await purchaseOrderService.createPurchaseOrder(req.tenantId!, req.body);
      sendCreated(res, po, 'Purchase order created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const po = await purchaseOrderService.getPurchaseOrderById(req.params.id, req.tenantId!);
      sendSuccess(res, po, 'Purchase order retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const po = await purchaseOrderService.updatePurchaseOrder(req.params.id, req.tenantId!, req.body);
      sendSuccess(res, po, 'Purchase order updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await purchaseOrderService.deletePurchaseOrder(req.params.id, req.tenantId!);
      sendSuccess(res, null, 'Purchase order deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 20, sortBy, sortOrder, ...filters } = req.query;
      const { orders, total } = await purchaseOrderService.listPurchaseOrders(
        req.tenantId!,
        filters,
        Number(page),
        Number(limit),
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );
      sendPaginated(res, orders, Number(page), Number(limit), total);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const stats = await purchaseOrderService.getPurchaseOrderStats(
        req.tenantId!,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      sendSuccess(res, stats, 'Purchase order statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new PurchaseOrderController();
