import prisma from '../../database/client';
import {
  FarmerDashboardStats,
  DeliveryHistory,
  MilkStatement,
  CollectionReceipt,
  FarmerPayment,
  LoanApplication,
  FarmerLoan,
  LoanRepaymentSchedule,
  FarmerShare,
  FarmerProfile,
  BankDetails,
} from './farmer-portal.types';

export class FarmerPortalService {
  async getDashboardStats(tenantId: string, userId: string): Promise<FarmerDashboardStats> {
    const farmer = await this.getFarmerByUserId(tenantId, userId);

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [todaysMilk, monthlyMilk, balance, activeLoans, shares] = await Promise.all([
      this.getTodaysMilkDelivery(tenantId, farmer.id, today),
      this.getMonthlyMilkDelivered(tenantId, farmer.id, startOfMonth),
      this.getCurrentBalance(tenantId, farmer.id),
      this.getActiveLoansCount(tenantId, farmer.id),
      this.getSharesOwnedCount(tenantId, farmer.id),
    ]);

    return {
      todaysMilkDelivery: todaysMilk,
      monthlyMilkDelivered: monthlyMilk,
      currentBalance: balance,
      activeLoans,
      sharesOwned: shares,
      unreadNotifications: 0,
    };
  }

  private async getFarmerByUserId(tenantId: string, userId: string) {
    const farmer = await prisma.farmer.findFirst({
      where: {
        tenantId,
        deletedAt: null,
      },
    });

    return farmer;
  }

  private async getTodaysMilkDelivery(tenantId: string, farmerId: string, today: Date): Promise<number> {
    const result = await prisma.milkCollection.aggregate({
      where: {
        tenantId,
        farmerId,
        date: { gte: today },
        status: 'ACCEPTED',
        deletedAt: null,
      },
      _sum: { quantity: true },
    });
    return Number(result._sum.quantity || 0);
  }

  private async getMonthlyMilkDelivered(tenantId: string, farmerId: string, startOfMonth: Date): Promise<number> {
    const result = await prisma.milkCollection.aggregate({
      where: {
        tenantId,
        farmerId,
        date: { gte: startOfMonth },
        status: 'ACCEPTED',
        deletedAt: null,
      },
      _sum: { quantity: true },
    });
    return Number(result._sum.quantity || 0);
  }

  private async getCurrentBalance(tenantId: string, farmerId: string): Promise<number> {
    const [collections, payments] = await Promise.all([
      prisma.milkCollection.aggregate({
        where: {
          tenantId,
          farmerId,
          status: 'ACCEPTED',
          deletedAt: null,
        },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: {
          tenantId,
          farmerId,
          status: 'PAID',
          deletedAt: null,
        },
        _sum: { netAmount: true },
      }),
    ]);

    const totalEarned = Number(collections._sum.amount || 0);
    const totalPaid = Number(payments._sum.netAmount || 0);
    return totalEarned - totalPaid;
  }

  private async getActiveLoansCount(tenantId: string, farmerId: string): Promise<number> {
    return prisma.loan.count({
      where: {
        tenantId,
        farmerId,
        status: 'ACTIVE',
        deletedAt: null,
      },
    });
  }

  private async getSharesOwnedCount(tenantId: string, farmerId: string): Promise<number> {
    const result = await prisma.share.aggregate({
      where: {
        tenantId,
        farmerId,
        status: 'ACTIVE',
        deletedAt: null,
      },
      _sum: { shareCount: true },
    });
    return result._sum.shareCount || 0;
  }

  async getDeliveryHistory(tenantId: string, userId: string, page = 1, limit = 20) {
    const farmer = await this.getFarmerByUserId(tenantId, userId);

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    const where = {
      tenantId,
      farmerId: farmer.id,
      deletedAt: null,
    };

    const [collections, total] = await Promise.all([
      prisma.milkCollection.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.milkCollection.count({ where }),
    ]);

    const data: DeliveryHistory[] = collections.map((c) => ({
      id: c.id,
      date: c.date,
      shift: c.shift as 'MORNING' | 'EVENING',
      quantity: Number(c.quantity),
      fat: Number(c.fat),
      snf: Number(c.snf),
      quality: c.quality,
      rate: Number(c.amount) / Number(c.quantity),
      amount: Number(c.amount),
      status: c.status as 'ACCEPTED' | 'REJECTED',
      reason: c.reason || undefined,
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

  async getMilkStatement(tenantId: string, userId: string, startDate?: Date, endDate?: Date): Promise<MilkStatement> {
    const farmer = await this.getFarmerByUserId(tenantId, userId);

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    const where: any = {
      tenantId,
      farmerId: farmer.id,
      status: 'ACCEPTED',
      deletedAt: null,
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const collections = await prisma.milkCollection.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    const totalQuantity = collections.reduce((sum, c) => sum + Number(c.quantity), 0);
    const totalAmount = collections.reduce((sum, c) => sum + Number(c.amount), 0);

    const morningCollections = collections.filter((c) => c.shift === 'MORNING').length;
    const eveningCollections = collections.filter((c) => c.shift === 'EVENING').length;
    const excellentQuality = collections.filter((c) => c.quality === 'EXCELLENT').length;
    const goodQuality = collections.filter((c) => c.quality === 'GOOD').length;
    const averageQuality = collections.filter((c) => c.quality === 'AVERAGE').length;

    const averageQualityScore =
      collections.length > 0
        ? collections.reduce((sum, c) => {
            if (c.quality === 'EXCELLENT') return sum + 4;
            if (c.quality === 'GOOD') return sum + 3;
            if (c.quality === 'AVERAGE') return sum + 2;
            return sum + 1;
          }, 0) / collections.length
        : 0;

    let qualityText = 'AVERAGE';
    if (averageQualityScore >= 3.5) qualityText = 'EXCELLENT';
    else if (averageQualityScore >= 2.5) qualityText = 'GOOD';

    return {
      period: `${startDate?.toLocaleDateString() || 'Beginning'} - ${endDate?.toLocaleDateString() || 'Now'}`,
      totalQuantity,
      totalAmount,
      averageQuality: qualityText,
      collections: collections.map((c) => ({
        date: c.date,
        shift: c.shift,
        quantity: Number(c.quantity),
        rate: Number(c.amount) / Number(c.quantity),
        amount: Number(c.amount),
      })),
      summary: {
        morningCollections,
        eveningCollections,
        excellentQuality,
        goodQuality,
        averageQuality,
      },
    };
  }

  async getCollectionReceipt(tenantId: string, userId: string, collectionId: string): Promise<CollectionReceipt | null> {
    const farmer = await this.getFarmerByUserId(tenantId, userId);

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    const collection = await prisma.milkCollection.findFirst({
      where: {
        id: collectionId,
        tenantId,
        farmerId: farmer.id,
        deletedAt: null,
      },
    });

    if (!collection) {
      return null;
    }

    return {
      receiptNumber: `RCP-${collection.id.slice(-8).toUpperCase()}`,
      date: collection.date,
      shift: collection.shift,
      quantity: Number(collection.quantity),
      fat: Number(collection.fat),
      snf: Number(collection.snf),
      quality: collection.quality,
      rate: Number(collection.amount) / Number(collection.quantity),
      amount: Number(collection.amount),
      farmerName: `${farmer.firstName} ${farmer.lastName}`,
      farmerCode: farmer.farmerId,
      collectedBy: collection.collectedBy,
      centerId: collection.centerId || undefined,
    };
  }

  async getPaymentHistory(tenantId: string, userId: string, page = 1, limit = 20) {
    const farmer = await this.getFarmerByUserId(tenantId, userId);

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    const where = {
      tenantId,
      farmerId: farmer.id,
      deletedAt: null,
    };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);

    const data: FarmerPayment[] = payments.map((p) => ({
      id: p.id,
      paymentNumber: `PAY-${p.id.slice(-8).toUpperCase()}`,
      period: p.period,
      totalQuantity: Number(p.totalQuantity),
      totalAmount: Number(p.totalAmount),
      bonusAmount: Number(p.bonusAmount),
      deductionAmount: Number(p.deductionAmount),
      netAmount: Number(p.netAmount),
      status: p.status === 'REJECTED' ? 'PENDING' : p.status,
      paymentDate: p.paymentDate || undefined,
      paymentMode: p.paymentMode || undefined,
      transactionId: p.transactionId || undefined,
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

  async applyForLoan(tenantId: string, userId: string, application: LoanApplication) {
    const farmer = await this.getFarmerByUserId(tenantId, userId);

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    const monthlyRate = 0.01;
    const emi =
      (application.amount * monthlyRate * Math.pow(1 + monthlyRate, application.tenure)) /
      (Math.pow(1 + monthlyRate, application.tenure) - 1);

    const loan = await prisma.loan.create({
      data: {
        tenantId,
        farmerId: farmer.id,
        loanNumber: `LN-${Date.now()}`,
        amount: application.amount,
        interestRate: 12,
        tenure: application.tenure,
        emiAmount: emi,
        purpose: application.purpose,
        status: 'PENDING',
        appliedDate: new Date(),
        paidAmount: 0,
        outstandingAmount: application.amount,
      },
    });

    return loan;
  }

  async getLoanStatus(tenantId: string, userId: string, page = 1, limit = 20) {
    const farmer = await this.getFarmerByUserId(tenantId, userId);

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    const where = {
      tenantId,
      farmerId: farmer.id,
      deletedAt: null,
    };

    const [loans, total] = await Promise.all([
      prisma.loan.findMany({
        where,
        orderBy: { appliedDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.loan.count({ where }),
    ]);

    const data: FarmerLoan[] = loans.map((l) => ({
      id: l.id,
      loanNumber: l.loanNumber,
      amount: Number(l.amount),
      interestRate: Number(l.interestRate),
      tenure: l.tenure,
      emiAmount: Number(l.emiAmount),
      paidAmount: Number(l.paidAmount),
      outstandingAmount: Number(l.outstandingAmount),
      status: l.status,
      appliedDate: l.appliedDate,
      approvedDate: l.approvedDate || undefined,
      disbursementDate: l.disbursementDate || undefined,
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

  async getRepaymentSchedule(tenantId: string, userId: string, loanId: string): Promise<LoanRepaymentSchedule | null> {
    const farmer = await this.getFarmerByUserId(tenantId, userId);

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    const loan = await prisma.loan.findFirst({
      where: {
        id: loanId,
        tenantId,
        farmerId: farmer.id,
        deletedAt: null,
      },
    });

    if (!loan) {
      return null;
    }

    const principal = Number(loan.amount);
    const monthlyRate = Number(loan.interestRate) / 100 / 12;
    const tenure = loan.tenure;
    const emi = Number(loan.emiAmount);

    const installments = [];
    let balance = principal;
    const startDate = loan.disbursementDate || loan.approvedDate || loan.appliedDate;

    for (let i = 1; i <= tenure; i++) {
      const interest = balance * monthlyRate;
      const principalPaid = emi - interest;
      balance -= principalPaid;

      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      installments.push({
        installmentNumber: i,
        dueDate,
        principal: principalPaid,
        interest,
        totalEmi: emi,
        paid: false,
        balance: Math.max(0, balance),
      });
    }

    return {
      loanNumber: loan.loanNumber,
      amount: principal,
      emiAmount: emi,
      installments,
      totalPaid: Number(loan.paidAmount),
      totalRemaining: Number(loan.outstandingAmount),
    };
  }

  async getSharesOwned(tenantId: string, userId: string, page = 1, limit = 20) {
    const farmer = await this.getFarmerByUserId(tenantId, userId);

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    const where = {
      tenantId,
      farmerId: farmer.id,
      deletedAt: null,
    };

    const [shares, total] = await Promise.all([
      prisma.share.findMany({
        where,
        orderBy: { purchaseDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.share.count({ where }),
    ]);

    const data: FarmerShare[] = shares.map((s) => ({
      id: s.id,
      shareNumber: s.shareNumber,
      shareCount: s.shareCount,
      shareValue: Number(s.shareValue),
      totalValue: Number(s.totalValue),
      purchaseDate: s.purchaseDate,
      certificateNumber: s.certificateNumber || undefined,
      status: s.status as 'ACTIVE' | 'TRANSFERRED' | 'REDEEMED',
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

  async getAnimalRecords(tenantId: string, userId: string) {
    const farmer = await this.getFarmerByUserId(tenantId, userId);

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    return {
      data: [],
      total: 0,
    };
  }

  async updateProfile(tenantId: string, userId: string, updates: Partial<FarmerProfile>) {
    const farmer = await this.getFarmerByUserId(tenantId, userId);

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    const updated = await prisma.farmer.update({
      where: { id: farmer.id },
      data: {
        firstName: updates.firstName,
        lastName: updates.lastName,
        phoneNumber: updates.phoneNumber,
        email: updates.email,
        address: updates.address,
      },
    });

    return updated;
  }

  async updateBankDetails(tenantId: string, userId: string, details: BankDetails) {
    const farmer = await this.getFarmerByUserId(tenantId, userId);

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    const updated = await prisma.farmer.update({
      where: { id: farmer.id },
      data: {
        bankName: details.bankName,
        accountNumber: details.accountNumber,
      },
    });

    return updated;
  }

  async getNotifications(tenantId: string, userId: string, page = 1, limit = 20) {
    const farmer = await this.getFarmerByUserId(tenantId, userId);

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    return {
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }
}
