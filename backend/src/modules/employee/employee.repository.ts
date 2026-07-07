import prisma from '@database/client.js';
import { Employee, Prisma } from '@prisma/client';
import { CreateEmployeeData, UpdateEmployeeData, EmployeeFilters } from './employee.types.js';

class EmployeeRepository {
  async create(tenantId: string, data: CreateEmployeeData): Promise<Employee> {
    return prisma.employee.create({
      data: {
        tenantId,
        ...data,
        status: 'ACTIVE',
      },
    });
  }

  async findById(id: string, tenantId: string): Promise<Employee | null> {
    return prisma.employee.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }

  async findByEmployeeId(employeeId: string, tenantId: string): Promise<Employee | null> {
    return prisma.employee.findFirst({
      where: { employeeId, tenantId, deletedAt: null },
    });
  }

  async update(id: string, _tenantId: string, data: UpdateEmployeeData): Promise<Employee> {
    const updateData: Prisma.EmployeeUpdateInput = { ...data, updatedAt: new Date() };
    if (data.status) updateData.status = data.status as 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED' | 'TERMINATED';
    return prisma.employee.update({ where: { id }, data: updateData });
  }

  async softDelete(id: string, _tenantId: string): Promise<void> {
    await prisma.employee.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async findAll(
    tenantId: string,
    filters: EmployeeFilters,
    skip: number,
    take: number,
    orderBy?: Prisma.EmployeeOrderByWithRelationInput
  ): Promise<Employee[]> {
    const where: Prisma.EmployeeWhereInput = { tenantId, deletedAt: null };
    if (filters.department) where.department = { contains: filters.department };
    if (filters.designation) where.designation = { contains: filters.designation };
    if (filters.status) where.status = filters.status;
    if (filters.city) where.city = { contains: filters.city };
    if (filters.search) {
      where.OR = [
        { employeeId: { contains: filters.search } },
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { phoneNumber: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }
    return prisma.employee.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { createdAt: 'desc' },
    });
  }

  async count(tenantId: string, filters: EmployeeFilters): Promise<number> {
    const where: Prisma.EmployeeWhereInput = { tenantId, deletedAt: null };
    if (filters.department) where.department = { contains: filters.department };
    if (filters.designation) where.designation = { contains: filters.designation };
    if (filters.status) where.status = filters.status;
    if (filters.city) where.city = { contains: filters.city };
    if (filters.search) {
      where.OR = [
        { employeeId: { contains: filters.search } },
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { phoneNumber: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }
    return prisma.employee.count({ where });
  }

  async getStats(tenantId: string) {
    const where: Prisma.EmployeeWhereInput = { tenantId, deletedAt: null };
    const [total, active, onLeave, resigned, terminated, salaryAgg] = await Promise.all([
      prisma.employee.count({ where }),
      prisma.employee.count({ where: { ...where, status: 'ACTIVE' } }),
      prisma.employee.count({ where: { ...where, status: 'ON_LEAVE' } }),
      prisma.employee.count({ where: { ...where, status: 'RESIGNED' } }),
      prisma.employee.count({ where: { ...where, status: 'TERMINATED' } }),
      prisma.employee.aggregate({ where: { ...where, status: 'ACTIVE' }, _sum: { salary: true } }),
    ]);
    return {
      totalEmployees: total,
      activeEmployees: active,
      onLeaveEmployees: onLeave,
      resignedEmployees: resigned,
      terminatedEmployees: terminated,
      totalSalary: Number(salaryAgg._sum.salary) || 0,
    };
  }
}

export default new EmployeeRepository();
