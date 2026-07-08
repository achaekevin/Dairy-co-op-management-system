import { Request, Response, NextFunction } from 'express';
import { FarmerPortalService } from './farmer-portal.service';
import { sendSuccess } from '../../core/response';

const farmerPortalService = new FarmerPortalService();

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const stats = await farmerPortalService.getDashboardStats(tenantId, userId);
    sendSuccess(res, stats, 'Dashboard stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getDeliveryHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await farmerPortalService.getDeliveryHistory(tenantId, userId, page, limit);
    sendSuccess(res, result, 'Delivery history retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getMilkStatement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const result = await farmerPortalService.getMilkStatement(tenantId, userId, startDate, endDate);
    sendSuccess(res, result, 'Milk statement retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getCollectionReceipt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const { collectionId } = req.params;

    const result = await farmerPortalService.getCollectionReceipt(tenantId, userId, collectionId);
    if (!result) {
      sendSuccess(res, null, 'Receipt not found', 404);
      return;
    }
    sendSuccess(res, result, 'Collection receipt retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await farmerPortalService.getPaymentHistory(tenantId, userId, page, limit);
    sendSuccess(res, result, 'Payment history retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const applyForLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const application = req.body;

    const result = await farmerPortalService.applyForLoan(tenantId, userId, application);
    sendSuccess(res, result, 'Loan application submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getLoanStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await farmerPortalService.getLoanStatus(tenantId, userId, page, limit);
    sendSuccess(res, result, 'Loan status retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getRepaymentSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const { loanId } = req.params;

    const result = await farmerPortalService.getRepaymentSchedule(tenantId, userId, loanId);
    if (!result) {
      sendSuccess(res, null, 'Loan not found', 404);
      return;
    }
    sendSuccess(res, result, 'Repayment schedule retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getSharesOwned = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await farmerPortalService.getSharesOwned(tenantId, userId, page, limit);
    sendSuccess(res, result, 'Shares retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getAnimalRecords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;

    const result = await farmerPortalService.getAnimalRecords(tenantId, userId);
    sendSuccess(res, result, 'Animal records retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const updates = req.body;

    const result = await farmerPortalService.updateProfile(tenantId, userId, updates);
    sendSuccess(res, result, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const updateBankDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const details = req.body;

    const result = await farmerPortalService.updateBankDetails(tenantId, userId, details);
    sendSuccess(res, result, 'Bank details updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await farmerPortalService.getNotifications(tenantId, userId, page, limit);
    sendSuccess(res, result, 'Notifications retrieved successfully');
  } catch (error) {
    next(error);
  }
};
