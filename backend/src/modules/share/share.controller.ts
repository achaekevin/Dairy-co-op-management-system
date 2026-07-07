import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendPaginated } from '@core/response.js';
import shareService from './share.service.js';

class ShareController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const share = await shareService.createShare(req.tenantId!, req.body);
      sendCreated(res, share, 'Share created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const share = await shareService.getShareById(req.params.id, req.tenantId!);
      sendSuccess(res, share, 'Share retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const share = await shareService.updateShare(req.params.id, req.tenantId!, req.body);
      sendSuccess(res, share, 'Share updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await shareService.deleteShare(req.params.id, req.tenantId!);
      sendSuccess(res, null, 'Share deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 20, sortBy, sortOrder, ...filters } = req.query;
      const { shares, total } = await shareService.listShares(
        req.tenantId!,
        filters,
        Number(page),
        Number(limit),
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );
      sendPaginated(res, shares, Number(page), Number(limit), total);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const stats = await shareService.getShareStats(
        req.tenantId!,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      sendSuccess(res, stats, 'Share statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new ShareController();
