import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendPaginated } from '@core/response.js';
import paymentService from './payment.service.js';

class PaymentController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payment = await paymentService.createPayment(req.tenantId!, req.body);
      sendCreated(res, payment, 'Payment created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payment = await paymentService.getPaymentById(req.params.id, req.tenantId!);
      sendSuccess(res, payment, 'Payment retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payment = await paymentService.updatePayment(req.params.id, req.tenantId!, req.body);
      sendSuccess(res, payment, 'Payment updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await paymentService.deletePayment(req.params.id, req.tenantId!);
      sendSuccess(res, null, 'Payment deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 20, sortBy, sortOrder, ...filters } = req.query;
      const { payments, total } = await paymentService.listPayments(
        req.tenantId!,
        filters,
        Number(page),
        Number(limit),
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );
      sendPaginated(res, payments, Number(page), Number(limit), total);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const stats = await paymentService.getPaymentStats(
        req.tenantId!,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      sendSuccess(res, stats, 'Payment statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();
