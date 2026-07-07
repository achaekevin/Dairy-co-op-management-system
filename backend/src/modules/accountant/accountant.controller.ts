import { Request, Response, NextFunction } from 'express';
import { AccountantService } from './accountant.service';
import { sendSuccess } from '../../core/response';
import { AppError } from '../../core/errors';

const accountantService = new AccountantService();

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const stats = await accountantService.getDashboardStats(tenantId);
    sendSuccess(res, stats, 'Accountant dashboard stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const generatePayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { period, farmerIds } = req.body;

    if (!period) {
      throw new AppError('Period is required (format: YYYY-MM)', 400);
    }

    const result = await accountantService.generatePayments(tenantId, period, farmerIds);
    sendSuccess(res, result, 'Payments generated successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const approvePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { paymentId } = req.params;

    const payment = await accountantService.approvePayment(tenantId, paymentId);
    sendSuccess(res, payment, 'Payment approved successfully');
  } catch (error) {
    next(error);
  }
};

export const makePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { paymentId } = req.params;
    const { paymentMode, transactionId } = req.body;

    if (!paymentMode) {
      throw new AppError('Payment mode is required', 400);
    }

    const payment = await accountantService.makePayment(tenantId, paymentId, paymentMode, transactionId);
    sendSuccess(res, payment, 'Payment processed successfully');
  } catch (error) {
    next(error);
  }
};

export const getFarmerStatement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { farmerId } = req.params;
    const { startDate, endDate } = req.query;

    const statement = await accountantService.getFarmerStatement(
      tenantId,
      farmerId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    if (!statement) {
      throw new AppError('Farmer not found', 404);
    }

    sendSuccess(res, statement, 'Farmer statement retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getLoanLedger = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { page, limit } = req.query;

    const ledger = await accountantService.getLoanLedger(
      tenantId,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20
    );

    sendSuccess(res, ledger, 'Loan ledger retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getRepaymentSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { loanId } = req.params;

    const schedule = await accountantService.getRepaymentSchedule(tenantId, loanId);

    if (!schedule) {
      throw new AppError('Loan not found', 404);
    }

    sendSuccess(res, schedule, 'Repayment schedule retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const calculateInterest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { principal, rate, tenure } = req.body;

    if (!principal || !rate || !tenure) {
      throw new AppError('Principal, rate, and tenure are required', 400);
    }

    const calculation = accountantService.calculateInterest(
      parseFloat(principal),
      parseFloat(rate),
      parseInt(tenure)
    );

    sendSuccess(res, calculation, 'Interest calculated successfully');
  } catch (error) {
    next(error);
  }
};

export const getShareContributions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { page, limit } = req.query;

    const contributions = await accountantService.getShareContributions(
      tenantId,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20
    );

    sendSuccess(res, contributions, 'Share contributions retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const calculateDividends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { dividendRate } = req.body;

    if (!dividendRate) {
      throw new AppError('Dividend rate is required', 400);
    }

    const dividends = await accountantService.calculateDividends(tenantId, parseFloat(dividendRate));
    sendSuccess(res, dividends, 'Dividends calculated successfully');
  } catch (error) {
    next(error);
  }
};

export const getEmployeeSalaries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { page, limit } = req.query;

    const salaries = await accountantService.getEmployeeSalaries(
      tenantId,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20
    );

    sendSuccess(res, salaries, 'Employee salaries retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getFinancialReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError('Start date and end date are required', 400);
    }

    const report = await accountantService.getFinancialReport(
      tenantId,
      new Date(startDate as string),
      new Date(endDate as string)
    );

    sendSuccess(res, report, 'Financial report retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getCashFlowReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError('Start date and end date are required', 400);
    }

    const report = await accountantService.getCashFlowReport(
      tenantId,
      new Date(startDate as string),
      new Date(endDate as string)
    );

    sendSuccess(res, report, 'Cash flow report retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getRevenueReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId as string;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError('Start date and end date are required', 400);
    }

    const report = await accountantService.getRevenueReport(
      tenantId,
      new Date(startDate as string),
      new Date(endDate as string)
    );

    sendSuccess(res, report, 'Revenue report retrieved successfully');
  } catch (error) {
    next(error);
  }
};
