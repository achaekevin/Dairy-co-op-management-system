import { Request, Response, NextFunction } from 'express';
import { SuperAdminService } from './super-admin.service';
import { sendSuccess } from '../../core/response';

const superAdminService = new SuperAdminService();

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const stats = await superAdminService.getDashboardStats(tenantId);
    sendSuccess(res, stats, 'Dashboard statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getSystemHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const health = await superAdminService.getSystemHealth();
    sendSuccess(res, health, 'System health retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const query = {
      userId: req.query.userId as string,
      action: req.query.action as string,
      entity: req.query.entity as string,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    const logs = await superAdminService.getAuditLogs(tenantId, query);
    sendSuccess(res, logs, 'Audit logs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getLoginHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const query = {
      userId: req.query.userId as string,
      status: req.query.status as 'success' | 'failed',
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    const history = await superAdminService.getLoginHistory(tenantId, query);
    sendSuccess(res, history, 'Login history retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getSystemSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const settings = await superAdminService.getSystemSettings(tenantId);
    sendSuccess(res, settings, 'System settings retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateSystemSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const settings = req.body;
    const updated = await superAdminService.updateSystemSettings(tenantId, settings);
    sendSuccess(res, updated, 'System settings updated successfully');
  } catch (error) {
    next(error);
  }
};

export const createBackup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const backup = await superAdminService.createBackup(tenantId);
    sendSuccess(res, backup, 'Backup created successfully');
  } catch (error) {
    next(error);
  }
};

export const getBackups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const backups = await superAdminService.getBackups(tenantId);
    sendSuccess(res, backups, 'Backups retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const restoreBackup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { backupId } = req.params;
    await superAdminService.restoreBackup(tenantId, backupId);
    sendSuccess(res, null, 'Backup restored successfully');
  } catch (error) {
    next(error);
  }
};
