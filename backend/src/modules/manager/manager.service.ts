import prisma from '../../database/client';
import {
  ManagerDashboardStats,
  QualitySummary,
  FarmerPerformance,
  CollectionSummary,
  CollectionCenterStats,
  LoanApplicationReview,
  ShareTransaction,
  DividendInfo,
  StaffInfo,
  DailyReport,
} from './manager.types';

export class ManagerService {
  async getDashboardStats(tenantId: string): Promise<ManagerDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todaysMilkCollection,
      farmersServedToday,
      revenueToday,
      pendingLoanApprovals,
      lowStockAlerts,
      pendingPayments,
      activeEmployees,
      qualitySummary,
    ] = await Promise.all([
      this.getTodaysMilkCollection(tenantId, today),
      this.getFarmersServedToday(tenantId, today),
      this.getRevenueToday(tenantId, today),
      this.getPendingLoanApprovals(tenantId),
      this.getLowStockAlerts(tenantId),
      this.getPendingPayments(tenantId),
      this.getActiveEmployees(tenantId),
      this.getQualitySummary(tenantId, today),
    ]);

    return {
      todaysMilkCollection,
      farmersServedToday,
      revenueToday,
      pendingLoanApprovals,
      lowStockAlerts,
      pendingPayments,
      activeEmployees,
      qualitySummary,
    };
  }

  private async getTodaysMilkCollection(tenantId: string, today: Date): Promise<number> {
    const result = await prisma.milkCollection.aggregate({
      where: {
        tenantId,
        date: { gte: today },
        status: 'ACCEPTED',
        deletedAt: null,
      },
      _sum: { quantity: true },
    });
    return Number(result._sum.quantity || 0);
  }

  private async getFarmersServedToday(tenantId: string, today: Date): Promise<number> {
    const farmers = await prisma.milkCollection.findMany({
      where: {
        tenantId,
        date: { gte: today },
        deletedAt: null,
      },
      select: { farmerId: true },
      distinct: ['farmerId'],
    });
    return farmers.length;
  }

  private async getRevenueToday(tenantId: string, today: Date): Promise<number> {
    const result = await prisma.payment.aggregate({
      where: {
        tenantId,
        createdAt: { gte: today },
        status: 'PAID',
        deletedAt: null,
      },
      _sum: { netAmount: true },
    });
    return Number(result._sum.netAmount || 0);
  }

  private async getPendingLoanApprovals(tenantId: string): Promise<number> {
    return prisma.loan.count({
      where: {
        tenantId,
        status: 'PENDING',
        deletedAt: null,
      },
    });
  }

  private async getLowStockAlerts(tenantId: string): Promise<number> {
    return prisma.inventoryItem.count({
      where: {
        tenantId,
        status: { in: ['LOW_STOCK', 'OUT_OF_STOCK'] },
        deletedAt: null,
      },
    });
  }

  private async getPendingPayments(tenantId: string): Promise<number> {
    return prisma.payment.count({
      where: {
        tenantId,
        status: { in: ['PENDING', 'APPROVED'] },
        deletedAt: null,
      },
    });
  }

  private async getActiveEmployees(tenantId: string): Promise<number> {
    return prisma.employee.count({
      where: {
        tenantId,
        status: 'ACTIVE',
        deletedAt: null,
      },
    });
  }

  private async getQualitySummary(tenantId: string, today: Date): Promise<QualitySummary> {
    const collections = await prisma.milkCollection.findMany({
      where: {
        tenantId,
        date: { gte: today },
        deletedAt: null,
      },
      select: { quality: true },
    });

    const summary = {
      excellent: 0,
      good: 0,
      average: 0,
      poor: 0,
      totalTests: collections.length,
      averageQuality: 'N/A',
    };

    collections.forEach((c) => {
      if (c.quality === 'EXCELLENT') summary.excellent++;
      else if (c.quality === 'GOOD') summary.good++;
      else if (c.quality === 'AVERAGE') summary.average++;
      else if (c.quality === 'POOR') summary.poor++;
    });

    if (summary.totalTests > 0) {
      const score =
        (summary.excellent * 4 + summary.good * 3 + summary.average * 2 + summary.poor * 1) /
        summary.totalTests;
      if (score >= 3.5) summary.averageQuality = 'Excellent';
      else if (score >= 2.5) summary.averageQuality = 'Good';
      else if (score >= 1.5) summary.averageQuality = 'Average';
      else summary.averageQuality = 'Poor';
    }

    return summary;
  }

  async getFarmerPerformance(
    tenantId: string,
    startDate?: Date,
    endDate?: Date,
    page = 1,
    limit = 20
  ) {
    const where: any = {
      tenantId,
      deletedAt: null,
    };

    const collectionWhere: any = {
      tenantId,
      deletedAt: null,
    };

    if (startDate || endDate) {
      collectionWhere.date = {};
      if (startDate) collectionWhere.date.gte = startDate;
      if (endDate) collectionWhere.date.lte = endDate;
    }

    const farmers = await prisma.farmer.findMany({
      where,
      include: {
        milkCollections: {
          where: collectionWhere,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const performance: FarmerPerformance[] = farmers.map((farmer) => {
      const totalMilk = farmer.milkCollections.reduce((sum, c) => sum + Number(c.quantity), 0);
      const totalRevenue = farmer.milkCollections.reduce((sum, c) => sum + Number(c.amount), 0);
      const lastCollection =
        farmer.milkCollections.length > 0
          ? farmer.milkCollections[farmer.milkCollections.length - 1].date
          : null;

      const qualityScores = farmer.milkCollections.map((c) => {
        if (c.quality === 'EXCELLENT') return 4;
        if (c.quality === 'GOOD') return 3;
        if (c.quality === 'AVERAGE') return 2;
        return 1;
      });
      const avgScore =
        qualityScores.length > 0
          ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length
          : 0;
      const avgQuality =
        avgScore >= 3.5 ? 'Excellent' : avgScore >= 2.5 ? 'Good' : avgScore >= 1.5 ? 'Average' : 'Poor';

      return {
        farmerId: farmer.id,
        farmerName: `${farmer.firstName} ${farmer.lastName}`,
        totalMilk,
        averageQuality: avgQuality,
        totalRevenue,
        lastCollection: lastCollection!,
        status: farmer.status,
      };
    });

    const total = await prisma.farmer.count({ where });

    return {
      data: performance,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCollectionSummary(tenantId: string, date?: Date): Promise<CollectionSummary> {
    const targetDate = date || new Date();
    targetDate.setHours(0, 0, 0, 0);

    const collections = await prisma.milkCollection.findMany({
      where: {
        tenantId,
        date: { gte: targetDate },
        deletedAt: null,
      },
    });

    const summary = {
      totalCollection: 0,
      morningShift: 0,
      eveningShift: 0,
      acceptedMilk: 0,
      rejectedMilk: 0,
      totalFarmers: new Set<string>(),
      averageQuality: 0,
    };

    let qualitySum = 0;

    collections.forEach((c) => {
      const qty = Number(c.quantity);
      summary.totalCollection += qty;

      if (c.shift === 'MORNING') summary.morningShift += qty;
      else summary.eveningShift += qty;

      if (c.status === 'ACCEPTED') summary.acceptedMilk += qty;
      else summary.rejectedMilk += qty;

      summary.totalFarmers.add(c.farmerId);

      if (c.quality === 'EXCELLENT') qualitySum += 4;
      else if (c.quality === 'GOOD') qualitySum += 3;
      else if (c.quality === 'AVERAGE') qualitySum += 2;
      else qualitySum += 1;
    });

    return {
      totalCollection: summary.totalCollection,
      morningShift: summary.morningShift,
      eveningShift: summary.eveningShift,
      acceptedMilk: summary.acceptedMilk,
      rejectedMilk: summary.rejectedMilk,
      totalFarmers: summary.totalFarmers.size,
      averageQuality: collections.length > 0 ? qualitySum / collections.length : 0,
    };
  }

  async getCollectionCenters(tenantId: string): Promise<CollectionCenterStats[]> {
    const collections = await prisma.milkCollection.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      select: {
        centerId: true,
        quantity: true,
        quality: true,
        farmerId: true,
      },
    });

    const centers = new Map<string, any>();

    collections.forEach((c) => {
      const centerId = c.centerId || 'default';
      if (!centers.has(centerId)) {
        centers.set(centerId, {
          totalCollection: 0,
          farmers: new Set(),
          qualitySum: 0,
          qualityCount: 0,
        });
      }

      const center = centers.get(centerId);
      center.totalCollection += Number(c.quantity);
      center.farmers.add(c.farmerId);
      center.qualityCount++;

      if (c.quality === 'EXCELLENT') center.qualitySum += 4;
      else if (c.quality === 'GOOD') center.qualitySum += 3;
      else if (c.quality === 'AVERAGE') center.qualitySum += 2;
      else center.qualitySum += 1;
    });

    const result: CollectionCenterStats[] = [];
    centers.forEach((value, key) => {
      result.push({
        centerId: key,
        centerName: `Collection Center ${key}`,
        totalCollection: value.totalCollection,
        farmerCount: value.farmers.size,
        qualityAverage: value.qualityCount > 0 ? value.qualitySum / value.qualityCount : 0,
      });
    });

    return result;
  }

  async getPendingLoans(tenantId: string, page = 1, limit = 20) {
    const where = {
      tenantId,
      status: 'PENDING',
      deletedAt: null,
    };

    const [loans, total] = await Promise.all([
      prisma.loan.findMany({
        where,
        include: {
          farmer: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { appliedDate: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.loan.count({ where }),
    ]);

    const data: LoanApplicationReview[] = loans.map((loan) => ({
      id: loan.id,
      loanNumber: loan.loanNumber,
      farmerId: loan.farmerId,
      farmerName: `${loan.farmer.firstName} ${loan.farmer.lastName}`,
      amount: Number(loan.amount),
      purpose: loan.purpose,
      interestRate: Number(loan.interestRate),
      tenure: loan.tenure,
      appliedDate: loan.appliedDate,
      status: loan.status,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async approveLoan(tenantId: string, loanId: string) {
    const loan = await prisma.loan.findFirst({
      where: { id: loanId, tenantId, deletedAt: null },
    });

    if (!loan) {
      throw new Error('Loan not found');
    }

    return prisma.loan.update({
      where: { id: loanId },
      data: {
        status: 'APPROVED',
        approvedDate: new Date(),
      },
    });
  }

  async rejectLoan(tenantId: string, loanId: string, reason?: string) {
    const loan = await prisma.loan.findFirst({
      where: { id: loanId, tenantId, deletedAt: null },
    });

    if (!loan) {
      throw new Error('Loan not found');
    }

    return prisma.loan.update({
      where: { id: loanId },
      data: {
        status: 'REJECTED',
      },
    });
  }

  async getShareTransactions(tenantId: string, page = 1, limit = 20) {
    const where = {
      tenantId,
      deletedAt: null,
    };

    const [shares, total] = await Promise.all([
      prisma.share.findMany({
        where,
        include: {
          farmer: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { purchaseDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.share.count({ where }),
    ]);

    const data: ShareTransaction[] = shares.map((share) => ({
      id: share.id,
      shareNumber: share.shareNumber,
      farmerId: share.farmerId,
      farmerName: `${share.farmer.firstName} ${share.farmer.lastName}`,
      shareCount: share.shareCount,
      totalValue: Number(share.totalValue),
      purchaseDate: share.purchaseDate,
      status: share.status,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDividendInfo(tenantId: string): Promise<DividendInfo> {
    const shares = await prisma.share.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        deletedAt: null,
      },
    });

    const totalShareCapital = shares.reduce((sum, s) => sum + Number(s.totalValue), 0);
    const dividendRate = 8;
    const totalDividend = (totalShareCapital * dividendRate) / 100;

    return {
      totalShareCapital,
      dividendRate,
      totalDividend,
      paidDividend: 0,
      pendingDividend: totalDividend,
    };
  }

  async getStaff(tenantId: string, page = 1, limit = 20) {
    const where = {
      tenantId,
      deletedAt: null,
    };

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        orderBy: { firstName: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.employee.count({ where }),
    ]);

    const data: StaffInfo[] = employees.map((emp) => ({
      id: emp.id,
      employeeId: emp.employeeId,
      name: `${emp.firstName} ${emp.lastName}`,
      designation: emp.designation,
      department: emp.department,
      status: emp.status,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDailyReport(tenantId: string, date: Date): Promise<DailyReport> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [milkCollection, farmersServed, revenue, payments, newLoans, qualitySummary] =
      await Promise.all([
        this.getTodaysMilkCollection(tenantId, startOfDay),
        this.getFarmersServedToday(tenantId, startOfDay),
        this.getRevenueToday(tenantId, startOfDay),
        this.getPendingPayments(tenantId),
        prisma.loan.count({
          where: {
            tenantId,
            appliedDate: { gte: startOfDay, lte: endOfDay },
            deletedAt: null,
          },
        }),
        this.getQualitySummary(tenantId, startOfDay),
      ]);

    return {
      date,
      milkCollection,
      farmersServed,
      revenue,
      payments,
      newLoans,
      quality: qualitySummary,
    };
  }
}
