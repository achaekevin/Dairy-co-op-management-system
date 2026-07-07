import { NotFoundError, ConflictError } from '@core/errors.js';
import employeeRepository from './employee.repository.js';
import cacheService from '@shared/services/cache.service.js';
import { Prisma } from '@prisma/client';
import { CreateEmployeeData, UpdateEmployeeData, EmployeeFilters, EmployeeStats } from './employee.types.js';
import { Employee } from '@prisma/client';

class EmployeeService {
  async createEmployee(tenantId: string, data: CreateEmployeeData): Promise<Employee> {
    const existing = await employeeRepository.findByEmployeeId(data.employeeId, tenantId);
    if (existing) throw new ConflictError('Employee ID already exists');

    const employee = await employeeRepository.create(tenantId, data);
    await cacheService.deletePattern(`employees:${tenantId}:*`);
    return employee;
  }

  async getEmployeeById(id: string, tenantId: string): Promise<Employee> {
    const employee = await employeeRepository.findById(id, tenantId);
    if (!employee) throw new NotFoundError('Employee not found');
    return employee;
  }

  async updateEmployee(id: string, tenantId: string, data: UpdateEmployeeData): Promise<Employee> {
    const employee = await employeeRepository.findById(id, tenantId);
    if (!employee) throw new NotFoundError('Employee not found');

    const updated = await employeeRepository.update(id, tenantId, data);
    await cacheService.deletePattern(`employees:${tenantId}:*`);
    return updated;
  }

  async deleteEmployee(id: string, tenantId: string): Promise<void> {
    const employee = await employeeRepository.findById(id, tenantId);
    if (!employee) throw new NotFoundError('Employee not found');

    await employeeRepository.softDelete(id, tenantId);
    await cacheService.deletePattern(`employees:${tenantId}:*`);
  }

  async listEmployees(
    tenantId: string,
    filters: EmployeeFilters,
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ employees: Employee[]; total: number }> {
    const skip = (page - 1) * limit;
    const orderBy: Prisma.EmployeeOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || 'desc' }
      : { createdAt: 'desc' };
    const [employees, total] = await Promise.all([
      employeeRepository.findAll(tenantId, filters, skip, limit, orderBy),
      employeeRepository.count(tenantId, filters),
    ]);
    return { employees, total };
  }

  async getEmployeeStats(tenantId: string): Promise<EmployeeStats> {
    return employeeRepository.getStats(tenantId);
  }
}

export default new EmployeeService();
