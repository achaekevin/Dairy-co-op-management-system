import { Request, Response, NextFunction } from 'express';
import { CustomerPortalService } from './customer-portal.service';
import { sendSuccess } from '../../core/response';

const customerPortalService = new CustomerPortalService();

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const stats = await customerPortalService.getDashboardStats(tenantId, userId);
    sendSuccess(res, stats, 'Dashboard stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    const result = await customerPortalService.getProducts(tenantId, page, limit, category, search);
    sendSuccess(res, result, 'Products retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getProductCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const result = await customerPortalService.getProductCategories(tenantId);
    sendSuccess(res, result, 'Product categories retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const orderData = req.body;

    const result = await customerPortalService.placeOrder(tenantId, userId, orderData);
    sendSuccess(res, result, 'Order placed successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getOrderHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await customerPortalService.getOrderHistory(tenantId, userId, page, limit);
    sendSuccess(res, result, 'Order history retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const trackOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const { orderNumber } = req.params;

    const result = await customerPortalService.trackOrder(tenantId, userId, orderNumber);
    if (!result) {
      sendSuccess(res, null, 'Order not found', 404);
      return;
    }
    sendSuccess(res, result, 'Order tracking retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const { orderId } = req.params;

    const result = await customerPortalService.cancelOrder(tenantId, userId, orderId);
    sendSuccess(res, result, 'Order cancelled successfully');
  } catch (error) {
    next(error);
  }
};

export const makePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const paymentData = req.body;

    const result = await customerPortalService.makePayment(tenantId, userId, paymentData);
    sendSuccess(res, result, 'Payment initiated successfully', 201);
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

    const result = await customerPortalService.getPaymentHistory(tenantId, userId, page, limit);
    sendSuccess(res, result, 'Payment history retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const { orderId } = req.params;

    const result = await customerPortalService.getInvoice(tenantId, userId, orderId);
    if (!result) {
      sendSuccess(res, null, 'Invoice not found', 404);
      return;
    }
    sendSuccess(res, result, 'Invoice retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createReturnRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const returnData = req.body;

    const result = await customerPortalService.createReturnRequest(tenantId, userId, returnData);
    sendSuccess(res, result, 'Return request created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getReturnStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await customerPortalService.getReturnStatus(tenantId, userId, page, limit);
    sendSuccess(res, result, 'Return status retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;

    const result = await customerPortalService.getProfile(tenantId, userId);
    sendSuccess(res, result, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const updates = req.body;

    const result = await customerPortalService.updateProfile(tenantId, userId, updates);
    sendSuccess(res, result, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getDeliveryAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;

    const result = await customerPortalService.getDeliveryAddresses(tenantId, userId);
    sendSuccess(res, result, 'Delivery addresses retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const saveDeliveryAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const address = req.body;

    const result = await customerPortalService.saveDeliveryAddress(tenantId, userId, address);
    sendSuccess(res, result, 'Delivery address saved successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getSavedPaymentMethods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;

    const result = await customerPortalService.getSavedPaymentMethods(tenantId, userId);
    sendSuccess(res, result, 'Payment methods retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const savePaymentMethod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const userId = req.user?.userId as string;
    const method = req.body;

    const result = await customerPortalService.savePaymentMethod(tenantId, userId, method);
    sendSuccess(res, result, 'Payment method saved successfully', 201);
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

    const result = await customerPortalService.getNotifications(tenantId, userId, page, limit);
    sendSuccess(res, result, 'Notifications retrieved successfully');
  } catch (error) {
    next(error);
  }
};
