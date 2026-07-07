import { Request, Response, NextFunction } from 'express';
import { ManagerService } from './manager.service';
import { sendSuccess } from '../../core/response';

const managerService = new ManagerService();

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const stats = await managerService.getDashboardStats(tenantId);
    sendSuccess(res, stats, 'Manager dashboard stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getFarmerPerformance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { startDate, endDate, page, limit } = req.query;

    const performance = await managerService.getFarmerPerformance(
      tenantId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20
    );

    sendSuccess(res, performance, 'Farmer performance retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getCollectionSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { date } = req.query;

    const summary = await managerService.getCollectionSummary(
      tenantId,
      date ? new Date(date as string) : undefined
    );

    sendSuccess(res, summary, 'Collection summary retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getCollectionCenters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const centers = await managerService.getCollectionCenters(tenantId);
    sendSuccess(res, centers, 'Collection centers retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getPendingLoans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { page, limit } = req.query;

    const loans = await managerService.getPendingLoans(
      tenantId,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20
    );

    sendSuccess(res, loans, 'Pending loans retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const approveLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { loanId } = req.params;

    const loan = await managerService.approveLoan(tenantId, loanId);
    sendSuccess(res, loan, 'Loan approved successfully');
  } catch (error) {
    next(error);
  }
};

export const rejectLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { loanId } = req.params;
    const { reason } = req.body;

    const loan = await managerService.rejectLoan(tenantId, loanId, reason);
    sendSuccess(res, loan, 'Loan rejected successfully');
  } catch (error) {
    next(error);
  }
};

export const getShareTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { page, limit } = req.query;

    const shares = await managerService.getShareTransactions(
      tenantId,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20
    );

    sendSuccess(res, shares, 'Share transactions retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getDividendInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const info = await managerService.getDividendInfo(tenantId);
    sendSuccess(res, info, 'Dividend information retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { page, limit } = req.query;

    const staff = await managerService.getStaff(
      tenantId,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20
    );

    sendSuccess(res, staff, 'Staff retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getDailyReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { date } = req.query;

    const report = await managerService.getDailyReport(
      tenantId,
      date ? new Date(date as string) : new Date()
    );

    sendSuccess(res, report, 'Daily report retrieved successfully');
  } catch (error) {
    next(error);
  }
};
