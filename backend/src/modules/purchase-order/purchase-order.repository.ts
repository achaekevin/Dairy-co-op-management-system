import prisma from '@database/client.js';
import { PurchaseOrder, Prisma } from '@prisma/client';
import { CreatePurchaseOrderData, UpdatePurchaseOrderData, PurchaseOrderFilters } from './purchase-order.types.js';

class PurchaseOrderRepository {
  async create(tenantId: string, data: CreatePurchaseOrderData & { balanceAmount: number }): Promise<PurchaseOrder> {
    return prisma.purchaseOrder.create({
      data: {
        tenantId,
        ...data,
        status: 'DRAFT',
        paymentStatus: 'UNPAID',
        paidAmount: 0,
      },
    });
  }

  async findById(id: string, tenantId: string): Promise<PurchaseOrder | null> {
    return prisma.purchaseOrder.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        supplier: { select: { supplierCode: true, name: true, phoneNumber: true } },
      },
    });
  }

  async findByPoNumber(poNumber: string, tenantId: string): Promise<PurchaseOrder | null> {
    return prisma.purchaseOrder.findFirst({
      where: { poNumber, tenantId, deletedAt: null },
    });
  }

  async update(id: string, _tenantId: string, data: UpdatePurchaseOrderData): Promise<PurchaseOrder> {
    const updateData: Prisma.PurchaseOrderUpdateInput = { ...data, updatedAt: new Date() };
    if (data.status) updateData.status = data.status as 'DRAFT' | 'PENDING' | 'APPROVED' | 'DELIVERED' | 'CANCELLED';
    if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus as 'UNPAID' | 'PARTIAL' | 'PAID';
    return prisma.purchaseOrder.update({ where: { id }, data: updateData });
  }

  async softDelete(id: string, _tenantId: string): Promise<void> {
    await prisma.purchaseOrder.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async findAll(
    tenantId: string,
    filters: PurchaseOrderFilters,
    skip: number,
    take: number,
    orderBy?: Prisma.PurchaseOrderOrderByWithRelationInput
  ): Promise<PurchaseOrder[]> {
    const where: Prisma.PurchaseOrderWhereInput = { tenantId, deletedAt: null };
    if (filters.supplierId) where.supplierId = filters.supplierId;
    if (filters.status) where.status = filters.status;
    if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;
    if (filters.startDate || filters.endDate) {
      where.orderDate = {};
      if (filters.startDate) where.orderDate.gte = filters.startDate;
      if (filters.endDate) where.orderDate.lte = filters.endDate;
    }
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      where.totalAmount = {};
      if (filters.minAmount !== undefined) where.totalAmount.gte = filters.minAmount;
      if (filters.maxAmount !== undefined) where.totalAmount.lte = filters.maxAmount;
    }
    return prisma.purchaseOrder.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { orderDate: 'desc' },
      include: { supplier: { select: { supplierCode: true, name: true, phoneNumber: true } } },
    });
  }

  async count(tenantId: string, filters: PurchaseOrderFilters): Promise<number> {
    const where: Prisma.PurchaseOrderWhereInput = { tenantId, deletedAt: null };
    if (filters.supplierId) where.supplierId = filters.supplierId;
    if (filters.status) where.status = filters.status;
    if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;
    if (filters.startDate || filters.endDate) {
      where.orderDate = {};
      if (filters.startDate) where.orderDate.gte = filters.startDate;
      if (filters.endDate) where.orderDate.lte = filters.endDate;
    }
    return prisma.purchaseOrder.count({ where });
  }

  async getStats(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.PurchaseOrderWhereInput = { tenantId, deletedAt: null };
    if (startDate || endDate) {
      where.orderDate = {};
      if (startDate) where.orderDate.gte = startDate;
      if (endDate) where.orderDate.lte = endDate;
    }
    const [total, draft, pending, approved, delivered, cancelled, amountAgg, paidAgg, balanceAgg] = await Promise.all([
      prisma.purchaseOrder.count({ where }),
      prisma.purchaseOrder.count({ where: { ...where, status: 'DRAFT' } }),
      prisma.purchaseOrder.count({ where: { ...where, status: 'PENDING' } }),
      prisma.purchaseOrder.count({ where: { ...where, status: 'APPROVED' } }),
      prisma.purchaseOrder.count({ where: { ...where, status: 'DELIVERED' } }),
      prisma.purchaseOrder.count({ where: { ...where, status: 'CANCELLED' } }),
      prisma.purchaseOrder.aggregate({ where, _sum: { totalAmount: true } }),
      prisma.purchaseOrder.aggregate({ where, _sum: { paidAmount: true } }),
      prisma.purchaseOrder.aggregate({ where, _sum: { balanceAmount: true } }),
    ]);
    return {
      totalOrders: total,
      draftOrders: draft,
      pendingOrders: pending,
      approvedOrders: approved,
      deliveredOrders: delivered,
      cancelledOrders: cancelled,
      totalAmount: Number(amountAgg._sum.totalAmount) || 0,
      totalPaid: Number(paidAgg._sum.paidAmount) || 0,
      totalBalance: Number(balanceAgg._sum.balanceAmount) || 0,
    };
  }
}

export default new PurchaseOrderRepository();
