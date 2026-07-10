import prisma from '@database/client.js';
import { Customer, Prisma } from '@prisma/client';
import { CreateCustomerData, UpdateCustomerData, CustomerFilters } from './customer.types.js';

class CustomerRepository {
  async create(tenantId: string, data: CreateCustomerData): Promise<Customer> {
    return prisma.customer.create({
      data: {
        tenantId,
        customerId: data.customerId as string,
        customerName: data.customerName,
        businessName: data.businessName,
        customerType: data.customerType,
        phoneNumber: data.phoneNumber,
        email: data.email,
        address: data.address,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
        gstNumber: data.gstNumber,
        status: 'ACTIVE',
        creditLimit: data.creditLimit || 0,
        creditDays: data.creditDays || 0,
        outstandingAmount: 0,
        totalSales: 0,
      },
    });
  }

  async findById(id: string, tenantId: string): Promise<Customer | null> {
    return prisma.customer.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }

  async findByCustomerId(customerId: string, tenantId: string): Promise<Customer | null> {
    return prisma.customer.findFirst({
      where: { customerId, tenantId, deletedAt: null },
    });
  }

  async update(id: string, _tenantId: string, data: UpdateCustomerData): Promise<Customer> {
    const updateData: Prisma.CustomerUpdateInput = { ...data, updatedAt: new Date() };
    if (data.customerType) updateData.customerType = data.customerType as 'RETAIL' | 'WHOLESALE' | 'DISTRIBUTOR' | 'INSTITUTION';
    if (data.status) updateData.status = data.status as 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
    return prisma.customer.update({ where: { id }, data: updateData });
  }

  async softDelete(id: string, _tenantId: string): Promise<void> {
    await prisma.customer.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async findAll(
    tenantId: string,
    filters: CustomerFilters,
    skip: number,
    take: number,
    orderBy?: Prisma.CustomerOrderByWithRelationInput
  ): Promise<Customer[]> {
    const where: Prisma.CustomerWhereInput = { tenantId, deletedAt: null };
    if (filters.customerType) where.customerType = filters.customerType;
    if (filters.status) where.status = filters.status;
    if (filters.city) where.city = { contains: filters.city };
    if (filters.hasOutstanding !== undefined) {
      if (filters.hasOutstanding) {
        where.outstandingAmount = { gt: 0 };
      } else {
        where.outstandingAmount = 0;
      }
    }
    if (filters.search) {
      where.OR = [
        { customerId: { contains: filters.search } },
        { customerName: { contains: filters.search } },
        { businessName: { contains: filters.search } },
        { phoneNumber: { contains: filters.search } },
      ];
    }
    return prisma.customer.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { createdAt: 'desc' },
    });
  }

  async count(tenantId: string, filters: CustomerFilters): Promise<number> {
    const where: Prisma.CustomerWhereInput = { tenantId, deletedAt: null };
    if (filters.customerType) where.customerType = filters.customerType;
    if (filters.status) where.status = filters.status;
    if (filters.city) where.city = { contains: filters.city };
    if (filters.search) {
      where.OR = [
        { customerId: { contains: filters.search } },
        { customerName: { contains: filters.search } },
        { businessName: { contains: filters.search } },
        { phoneNumber: { contains: filters.search } },
      ];
    }
    return prisma.customer.count({ where });
  }

  async getStats(tenantId: string) {
    const where: Prisma.CustomerWhereInput = { tenantId, deletedAt: null };
    const [total, active, inactive, blocked, outstandingAgg, salesAgg] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.count({ where: { ...where, status: 'ACTIVE' } }),
      prisma.customer.count({ where: { ...where, status: 'INACTIVE' } }),
      prisma.customer.count({ where: { ...where, status: 'BLOCKED' } }),
      prisma.customer.aggregate({ where, _sum: { outstandingAmount: true } }),
      prisma.customer.aggregate({ where, _sum: { totalSales: true } }),
    ]);
    return {
      totalCustomers: total,
      activeCustomers: active,
      inactiveCustomers: inactive,
      blockedCustomers: blocked,
      totalOutstanding: Number(outstandingAgg._sum.outstandingAmount) || 0,
      totalSales: Number(salesAgg._sum.totalSales) || 0,
    };
  }
}

export default new CustomerRepository();
