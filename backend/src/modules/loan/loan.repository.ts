import prisma from '@database/client.js';
import { Loan, Prisma } from '@prisma/client';
import { CreateLoanData, UpdateLoanData, LoanFilters } from './loan.types.js';

class LoanRepository {
  async create(tenantId: string, data: CreateLoanData & { emiAmount: number; outstandingAmount: number }): Promise<Loan> {
    return prisma.loan.create({
      data: {
        tenantId,
        loanNumber: data.loanNumber,
        farmerId: data.farmerId,
        amount: data.amount,
        interestRate: data.interestRate,
        tenure: data.tenure,
        emiAmount: data.emiAmount,
        purpose: data.purpose,
        outstandingAmount: data.outstandingAmount,
        status: 'PENDING',
      },
    });
  }

  async findById(id: string, tenantId: string): Promise<Loan | null> {
    return prisma.loan.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        farmer: { select: { farmerId: true, firstName: true, lastName: true, phoneNumber: true } },
      },
    });
  }

  async findByLoanNumber(loanNumber: string, tenantId: string): Promise<Loan | null> {
    return prisma.loan.findFirst({
      where: { loanNumber, tenantId, deletedAt: null },
    });
  }

  async update(id: string, _tenantId: string, data: UpdateLoanData): Promise<Loan> {
    const updateData: Prisma.LoanUpdateInput = { ...data, updatedAt: new Date() };
    if (data.status) updateData.status = data.status as 'PENDING' | 'APPROVED' | 'ACTIVE' | 'CLOSED' | 'REJECTED';
    return prisma.loan.update({ where: { id }, data: updateData });
  }

  async softDelete(id: string, _tenantId: string): Promise<void> {
    await prisma.loan.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async findAll(
    tenantId: string,
    filters: LoanFilters,
    skip: number,
    take: number,
    orderBy?: Prisma.LoanOrderByWithRelationInput
  ): Promise<Loan[]> {
    const where: Prisma.LoanWhereInput = { tenantId, deletedAt: null };
    if (filters.farmerId) where.farmerId = filters.farmerId;
    if (filters.status) where.status = filters.status;
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      where.amount = {};
      if (filters.minAmount !== undefined) where.amount.gte = filters.minAmount;
      if (filters.maxAmount !== undefined) where.amount.lte = filters.maxAmount;
    }
    if (filters.startDate || filters.endDate) {
      where.appliedDate = {};
      if (filters.startDate) where.appliedDate.gte = filters.startDate;
      if (filters.endDate) where.appliedDate.lte = filters.endDate;
    }
    return prisma.loan.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { appliedDate: 'desc' },
      include: { farmer: { select: { farmerId: true, firstName: true, lastName: true, phoneNumber: true } } },
    });
  }

  async count(tenantId: string, filters: LoanFilters): Promise<number> {
    const where: Prisma.LoanWhereInput = { tenantId, deletedAt: null };
    if (filters.farmerId) where.farmerId = filters.farmerId;
    if (filters.status) where.status = filters.status;
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      where.amount = {};
      if (filters.minAmount !== undefined) where.amount.gte = filters.minAmount;
      if (filters.maxAmount !== undefined) where.amount.lte = filters.maxAmount;
    }
    return prisma.loan.count({ where });
  }

  async getStats(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.LoanWhereInput = { tenantId, deletedAt: null };
    if (startDate || endDate) {
      where.appliedDate = {};
      if (startDate) where.appliedDate.gte = startDate;
      if (endDate) where.appliedDate.lte = endDate;
    }
    const [total, pending, approved, active, closed, rejected, amountAgg, outstandingAgg, paidAgg] = await Promise.all([
      prisma.loan.count({ where }),
      prisma.loan.count({ where: { ...where, status: 'PENDING' } }),
      prisma.loan.count({ where: { ...where, status: 'APPROVED' } }),
      prisma.loan.count({ where: { ...where, status: 'ACTIVE' } }),
      prisma.loan.count({ where: { ...where, status: 'CLOSED' } }),
      prisma.loan.count({ where: { ...where, status: 'REJECTED' } }),
      prisma.loan.aggregate({ where, _sum: { amount: true } }),
      prisma.loan.aggregate({ where, _sum: { outstandingAmount: true } }),
      prisma.loan.aggregate({ where, _sum: { paidAmount: true } }),
    ]);
    return {
      totalLoans: total,
      pendingLoans: pending,
      approvedLoans: approved,
      activeLoans: active,
      closedLoans: closed,
      rejectedLoans: rejected,
      totalDisbursed: Number(amountAgg._sum.amount) || 0,
      totalOutstanding: Number(outstandingAgg._sum.outstandingAmount) || 0,
      totalPaid: Number(paidAgg._sum.paidAmount) || 0,
    };
  }
}

export default new LoanRepository();
