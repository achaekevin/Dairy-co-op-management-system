import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendPaginated } from '@core/response.js';
import loanService from './loan.service.js';

class LoanController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loan = await loanService.createLoan(req.tenantId!, req.body);
      sendCreated(res, loan, 'Loan created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loan = await loanService.getLoanById(req.params.id, req.tenantId!);
      sendSuccess(res, loan, 'Loan retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loan = await loanService.updateLoan(req.params.id, req.tenantId!, req.body);
      sendSuccess(res, loan, 'Loan updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await loanService.deleteLoan(req.params.id, req.tenantId!);
      sendSuccess(res, null, 'Loan deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 20, sortBy, sortOrder, ...filters } = req.query;
      const { loans, total } = await loanService.listLoans(
        req.tenantId!,
        filters,
        Number(page),
        Number(limit),
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );
      sendPaginated(res, loans, Number(page), Number(limit), total);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const stats = await loanService.getLoanStats(
        req.tenantId!,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      sendSuccess(res, stats, 'Loan statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new LoanController();
