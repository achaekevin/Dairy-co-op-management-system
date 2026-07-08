import { Request, Response, NextFunction } from 'express';
import { StoreOfficerService } from './store-officer.service';
import { sendSuccess } from '../../core/response';

const storeOfficerService = new StoreOfficerService();

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const stats = await storeOfficerService.getDashboardStats(tenantId);
    sendSuccess(res, stats, 'Dashboard stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getStockLevels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string | undefined;

    const result = await storeOfficerService.getStockLevels(tenantId, page, limit, category);
    sendSuccess(res, result, 'Stock levels retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const adjustment = {
      ...req.body,
      adjustedBy: req.user?.userId,
    };

    const result = await storeOfficerService.adjustStock(tenantId, adjustment);
    sendSuccess(res, result, 'Stock adjusted successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const transferStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const transfer = {
      ...req.body,
      transferredBy: req.user?.userId,
      transferDate: new Date(),
    };

    const result = await storeOfficerService.transferStock(tenantId, transfer);
    sendSuccess(res, result, 'Stock transferred successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const recordFeedSale = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const sale = {
      ...req.body,
      saleDate: new Date(),
    };

    const result = await storeOfficerService.recordFeedSale(tenantId, sale);
    sendSuccess(res, result, 'Feed sale recorded successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getSuppliers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await storeOfficerService.getSuppliers(tenantId, page, limit);
    sendSuccess(res, result, 'Suppliers retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createPurchaseRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items } = req.body;
    const requestedBy = req.user?.userId as string;

    const result = await storeOfficerService.createPurchaseRequest(items, requestedBy);
    sendSuccess(res, result, 'Purchase request created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const receiveGoods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const goods = {
      ...req.body,
      receivedBy: req.user?.userId,
      receivedDate: new Date(),
    };

    const result = await storeOfficerService.receiveGoods(tenantId, goods);
    sendSuccess(res, result, 'Goods received successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const getWarehouseInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const result = await storeOfficerService.getWarehouseInventory(tenantId);
    sendSuccess(res, result, 'Warehouse inventory retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const reportDamagedStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const damaged = {
      ...req.body,
      reportedBy: req.user?.userId,
      damageDate: new Date(),
    };

    const result = await storeOfficerService.reportDamagedStock(tenantId, damaged);
    sendSuccess(res, result, 'Damaged stock reported successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getInventoryReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const result = await storeOfficerService.getInventoryReport(tenantId, startDate, endDate);
    sendSuccess(res, result, 'Inventory report generated successfully');
  } catch (error) {
    next(error);
  }
};

export const getPurchaseReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const result = await storeOfficerService.getPurchaseReport(tenantId, startDate, endDate);
    sendSuccess(res, result, 'Purchase report generated successfully');
  } catch (error) {
    next(error);
  }
};

export const getSupplierReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const result = await storeOfficerService.getSupplierReport(tenantId);
    sendSuccess(res, result, 'Supplier report generated successfully');
  } catch (error) {
    next(error);
  }
};
