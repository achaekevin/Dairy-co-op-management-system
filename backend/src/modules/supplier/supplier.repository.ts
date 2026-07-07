import prisma from '@database/client.js';
import { Supplier, Prisma } from '@prisma/client';
import { CreateSupplierData, UpdateSupplierData, SupplierFilters } from './supplier.types.js';

class SupplierRepository {
  async create(tenantId: string, data: CreateSupplierData): Promise<Supplier> {
    return prisma.supplier.create({
      data: {
        tenantId,
        ...data,
        status: 'ACTIVE',
        rating: 0,
        outstandingAmount: 0,
        totalPurchases: 0,
      },
    });
  }

  async findById(id: string, tenantId: string): Promise<Supplier | null> {
    return prisma.supplier.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }

  async findBySupplierCode(supplierCode: string, tenantId: string): Promise<Supplier | null> {
    return prisma.supplier.findFirst({
      where: { supplierCode, tenantId, deletedAt: null },
    });
  }

  async update(id: string, _tenantId: string, data: UpdateSupplierData): Promise<Supplier> {
    const updateData: Prisma.SupplierUpdateInput = { ...data, updatedAt: new Date() };
    if (data.status) updateData.status = data.status as 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
    return prisma.supplier.update({ where: { id }, data: updateData });
  }

  async softDelete(id: string, _tenantId: string): Promise<void> {
    await prisma.supplier.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async findAll(
    tenantId: string,
    filters: SupplierFilters,
    skip: number,
    take: number,
    orderBy?: Prisma.SupplierOrderByWithRelationInput
  ): Promise<Supplier[]> {
    const where: Prisma.SupplierWhereInput = { tenantId, deletedAt: null };
    if (filters.category) where.category = { contains: filters.category };
    if (filters.status) where.status = filters.status;
    if (filters.city) where.city = { contains: filters.city };
    if (filters.minRating !== undefined) where.rating = { gte: filters.minRating };
    if (filters.search) {
      where.OR = [
        { supplierCode: { contains: filters.search } },
        { name: { contains: filters.search } },
        { contactPerson: { contains: filters.search } },
        { phoneNumber: { contains: filters.search } },
      ];
    }
    return prisma.supplier.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { createdAt: 'desc' },
    });
  }

  async count(tenantId: string, filters: SupplierFilters): Promise<number> {
    const where: Prisma.SupplierWhereInput = { tenantId, deletedAt: null };
    if (filters.category) where.category = { contains: filters.category };
    if (filters.status) where.status = filters.status;
    if (filters.city) where.city = { contains: filters.city };
    if (filters.minRating !== undefined) where.rating = { gte: filters.minRating };
    if (filters.search) {
      where.OR = [
        { supplierCode: { contains: filters.search } },
        { name: { contains: filters.search } },
        { contactPerson: { contains: filters.search } },
        { phoneNumber: { contains: filters.search } },
      ];
    }
    return prisma.supplier.count({ where });
  }

  async getStats(tenantId: string) {
    const where: Prisma.SupplierWhereInput = { tenantId, deletedAt: null };
    const [total, active, inactive, blocked, outstandingAgg, purchasesAgg] = await Promise.all([
      prisma.supplier.count({ where }),
      prisma.supplier.count({ where: { ...where, status: 'ACTIVE' } }),
      prisma.supplier.count({ where: { ...where, status: 'INACTIVE' } }),
      prisma.supplier.count({ where: { ...where, status: 'BLOCKED' } }),
      prisma.supplier.aggregate({ where, _sum: { outstandingAmount: true } }),
      prisma.supplier.aggregate({ where, _sum: { totalPurchases: true } }),
    ]);
    return {
      totalSuppliers: total,
      activeSuppliers: active,
      inactiveSuppliers: inactive,
      blockedSuppliers: blocked,
      totalOutstanding: Number(outstandingAgg._sum.outstandingAmount) || 0,
      totalPurchases: Number(purchasesAgg._sum.totalPurchases) || 0,
    };
  }
}

export default new SupplierRepository();
