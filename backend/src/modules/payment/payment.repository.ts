import prisma from '@database/client.js';
import { Payment, Prisma } from '@prisma/client';
import { CreatePaymentData, UpdatePaymentData, PaymentFilters } from './payment.types.js';

class PaymentRepository {
  async create(tenantId: string, data: CreatePaymentData & { netAmount: number }): Promise<Payment> {
    return prisma.payment.create({
      data: {
        tenantId,
        farmerId: data.farmerId,
        period: data.period,
        totalQuantity: data.totalQuantity,
        totalAmount: data.totalAmount,
        bonusAmount: data.bonusAmount || 0,
        deductionAmount: data.deductionAmount || 0,
        netAmount: data.netAmount,
        status: 'PENDING',
      },
    });
  }

  async findById(id: string, tenantId: string): Promise<Payment | null> {
    return prisma.payment.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        farmer: { select: { farmerId: true, firstName: true, lastName: true } },
      },
    });
  }

  async update(id: string, _tenantId: string, data: UpdatePaymentData): Promise<Payment> {
    const updateData: Prisma.PaymentUpdateInput = { ...data, updatedAt: new Date() };
    if (data.status) updateData.status = data.status as 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
    if (data.paymentMode) updateData.paymentMode = data.paymentMode as 'BANK_TRANSFER' | 'CASH' | 'CHEQUE' | 'MOBILE_MONEY';
    return prisma.payment.update({ where: { id }, data: updateData });
  }

  async softDelete(id: string, _tenantId: string): Promise<void> {
    await prisma.payment.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async findAll(
    tenantId: string,
    filters: PaymentFilters,
    skip: number,
    take: number,
    orderBy?: Prisma.PaymentOrderByWithRelationInput
  ): Promise<Payment[]> {
    const where: Prisma.PaymentWhereInput = { tenantId, deletedAt: null };
    if (filters.farmerId) where.farmerId = filters.farmerId;
    if (filters.status) where.status = filters.status;
    if (filters.period) where.period = filters.period;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      where.netAmount = {};
      if (filters.minAmount !== undefined) where.netAmount.gte = filters.minAmount;
      if (filters.maxAmount !== undefined) where.netAmount.lte = filters.maxAmount;
    }
    return prisma.payment.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { createdAt: 'desc' },
      include: { farmer: { select: { farmerId: true, firstName: true, lastName: true } } },
    });
  }

  async count(tenantId: string, filters: PaymentFilters): Promise<number> {
    const where: Prisma.PaymentWhereInput = { tenantId, deletedAt: null };
    if (filters.farmerId) where.farmerId = filters.farmerId;
    if (filters.status) where.status = filters.status;
    if (filters.period) where.period = filters.period;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }
    return prisma.payment.count({ where });
  }

  async getStats(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.PaymentWhereInput = { tenantId, deletedAt: null };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }
    const [total, pending, approved, paid, rejected, aggregates] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.count({ where: { ...where, status: 'PENDING' } }),
      prisma.payment.count({ where: { ...where, status: 'APPROVED' } }),
      prisma.payment.count({ where: { ...where, status: 'PAID' } }),
      prisma.payment.count({ where: { ...where, status: 'REJECTED' } }),
      prisma.payment.aggregate({ where, _sum: { netAmount: true } }),
    ]);
    const paidAgg = await prisma.payment.aggregate({
      where: { ...where, status: 'PAID' },
      _sum: { netAmount: true },
    });
    return {
      totalPayments: total,
      pendingPayments: pending,
      approvedPayments: approved,
      paidPayments: paid,
      rejectedPayments: rejected,
      totalAmount: Number(aggregates._sum.netAmount) || 0,
      totalPaid: Number(paidAgg._sum.netAmount) || 0,
      totalPending: Number(aggregates._sum.netAmount) - Number(paidAgg._sum.netAmount) || 0,
    };
  }
}

export default new PaymentRepository();
