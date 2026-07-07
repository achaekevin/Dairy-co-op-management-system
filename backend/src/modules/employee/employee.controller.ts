import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendPaginated } from '@core/response.js';
import employeeService from './employee.service.js';

class EmployeeController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employee = await employeeService.createEmployee(req.tenantId!, req.body);
      sendCreated(res, employee, 'Employee created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employee = await employeeService.getEmployeeById(req.params.id, req.tenantId!);
      sendSuccess(res, employee, 'Employee retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employee = await employeeService.updateEmployee(req.params.id, req.tenantId!, req.body);
      sendSuccess(res, employee, 'Employee updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await employeeService.deleteEmployee(req.params.id, req.tenantId!);
      sendSuccess(res, null, 'Employee deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 20, sortBy, sortOrder, ...filters } = req.query;
      const { employees, total } = await employeeService.listEmployees(
        req.tenantId!,
        filters,
        Number(page),
        Number(limit),
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );
      sendPaginated(res, employees, Number(page), Number(limit), total);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await employeeService.getEmployeeStats(req.tenantId!);
      sendSuccess(res, stats, 'Employee statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new EmployeeController();
