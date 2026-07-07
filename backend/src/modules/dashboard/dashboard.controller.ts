import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '@core/response.js';
import dashboardService from './dashboard.service.js';

class DashboardController {
  async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const overview = await dashboardService.getDashboardOverview(req.tenantId!);
      sendSuccess(res, overview, 'Dashboard overview retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getFinancialSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const summary = await dashboardService.getFinancialSummary(
        req.tenantId!,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      sendSuccess(res, summary, 'Financial summary retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getOperationalMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const metrics = await dashboardService.getOperationalMetrics(
        req.tenantId!,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      sendSuccess(res, metrics, 'Operational metrics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAlerts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const alerts = await dashboardService.getAlerts(req.tenantId!);
      sendSuccess(res, alerts, 'Alerts retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
