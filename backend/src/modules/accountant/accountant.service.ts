import prisma from '../../database/client';
import {
  AccountantDashboardStats,
  PaymentGeneration,
  FarmerStatement,
  LoanLedger,
  RepaymentSchedule,
  InterestCalculation,
  ShareContribution,
  DividendPayment,
  EmployeeSalary,
  FinancialReport,
  CashFlowReport,
  RevenueReport,
} from './accountant.types';

export class AccountantService {
  async getDashboardStats(tenantId: string): Promise<AccountantDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [revenueToday, pendingPaymentsCount, monthlyRevenue, loanBalance, expenses] =
      await Promise.all([
        this.getRevenueToday(tenantId, today),
        this.getPendingPaymentsCount(tenantId),
        this.getMonthlyRevenue(tenantId, startOfMonth),
        this.getTotalLoanBalance(tenantId),
        this.getOutstandingExpenses(tenantId),
      ]);

    const cashFlow = monthlyRevenue - expenses;

    return {
      revenueToday,
      pendingPayments: pendingPaymentsCount,
      monthlyRevenue,
      loanBalance,
      cashFlow,
      outstandingExpenses: expenses,
    };
  }

  private async getRevenueToday(tenantId: string, today: Date): Promise<number> {
    const result = await prisma.payment.aggregate({
      where: {
        tenantId,
        paymentDate: { gte: today },
        status: 'PAID',
        deletedAt: null,
      },
      _sum: { netAmount: true },
    });
    return Number(result._sum.netAmount || 0);
  }

  private async getPendingPaymentsCount(tenantId: string): Promise<number> {
    return prisma.payment.count({
      where: {
        tenantId,
        status: { in: ['PENDING', 'APPROVED'] },
        deletedAt: null,
      },
    });
  }

  private async getMonthlyRevenue(tenantId: string, startOfMonth: Date): Promise<number> {
    const result = await prisma.payment.aggregate({
      where: {
        tenantId,
        paymentDate: { gte: startOfMonth },
        status: 'PAID',
        deletedAt: null,
      },
      _sum: { netAmount: true },
    });
    return Number(result._sum.netAmount || 0);
  }

  private async getTotalLoanBalance(tenantId: string): Promise<number> {
    const result = await prisma.loan.aggregate({
      where: {
        tenantId,
        status: 'ACTIVE',
        deletedAt: null,
      },
      _sum: { outstandingAmount: true },
    });
    return Number(result._sum.outstandingAmount || 0);
  }

  private async getOutstandingExpenses(tenantId: string): Promise<number> {
    const salaries = await prisma.employee.aggregate({
      where: {
        tenantId,
        status: 'ACTIVE',
        deletedAt: null,
      },
      _sum: { salary: true },
    });

    const pendingPayments = await prisma.payment.aggregate({
      where: {
        tenantId,
        status: { in: ['PENDING', 'APPROVED'] },
        deletedAt: null,
      },
      _sum: { netAmount: true },
    });

    return Number(salaries._sum.salary || 0) + Number(pendingPayments._sum.netAmount || 0);
  }

  async generatePayments(tenantId: string, period: string, farmerIds?: string[]) {
    const [year, month] = period.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const where: any = {
      tenantId,
      date: {
        gte: startDate,
        lte: endDate,
      },
      status: 'ACCEPTED',
      deletedAt: null,
    };

    if (farmerIds && farmerIds.length > 0) {
      where.farmerId = { in: farmerIds };
    }

    const collections = await prisma.milkCollection.findMany({
      where,
      include: {
        farmer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const farmerPayments = new Map<string, any>();

    collections.forEach((c) => {
      const farmerId = c.farmerId;
      if (!farmerPayments.has(farmerId)) {
        farmerPayments.set(farmerId, {
          farmerId,
          farmerName: `${c.farmer.firstName} ${c.farmer.lastName}`,
          totalQuantity: 0,
          totalAmount: 0,
        });
      }

      const payment = farmerPayments.get(farmerId);
      payment.totalQuantity += Number(c.quantity);
      payment.totalAmount += Number(c.amount);
    });

    const paymentsToCreate = Array.from(farmerPayments.values()).map((p) => ({
      tenantId,
      farmerId: p.farmerId,
      period,
      totalQuantity: p.totalQuantity,
      totalAmount: p.totalAmount,
      bonusAmount: 0,
      deductionAmount: 0,
      netAmount: p.totalAmount,
      status: 'PENDING' as const,
    }));

    const created = await prisma.payment.createMany({
      data: paymentsToCreate,
    });

    return { count: created.count, payments: paymentsToCreate };
  }

  async approvePayment(tenantId: string, paymentId: string) {
    const payment = await prisma.payment.findFirst({
      where: { id: paymentId, tenantId, deletedAt: null },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    return prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'APPROVED',
      },
    });
  }

  async makePayment(tenantId: string, paymentId: string, paymentMode: string, transactionId?: string) {
    const payment = await prisma.payment.findFirst({
      where: { id: paymentId, tenantId, deletedAt: null },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    return prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'PAID',
        paymentDate: new Date(),
        paymentMode,
        transactionId,
      },
    });
  }

  async getFarmerStatement(
    tenantId: string,
    farmerId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<FarmerStatement | null> {
    const farmer = await prisma.farmer.findFirst({
      where: { id: farmerId, tenantId, deletedAt: null },
    });

    if (!farmer) {
      return null;
    }

    const where: any = {
      tenantId,
      farmerId,
      deletedAt: null,
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const [collections, payments] = await Promise.all([
      prisma.milkCollection.findMany({
        where,
        orderBy: { date: 'asc' },
      }),
      prisma.payment.findMany({
        where: {
          tenantId,
          farmerId,
          deletedAt: null,
        },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const totalQuantity = collections.reduce((sum, c) => sum + Number(c.quantity), 0);
    const totalAmount = collections.reduce((sum, c) => sum + Number(c.amount), 0);
    const bonuses = payments.reduce((sum, p) => sum + Number(p.bonusAmount), 0);
    const deductions = payments.reduce((sum, p) => sum + Number(p.deductionAmount), 0);
    const netAmount = totalAmount + bonuses - deductions;

    return {
      farmerId: farmer.id,
      farmerName: `${farmer.firstName} ${farmer.lastName}`,
      period: `${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`,
      collections: collections.map((c) => ({
        date: c.date,
        quantity: Number(c.quantity),
        rate: Number(c.amount) / Number(c.quantity),
        amount: Number(c.amount),
      })),
      totalQuantity,
      totalAmount,
      bonuses,
      deductions,
      netAmount,
      payments: payments.map((p) => ({
        date: p.paymentDate || p.createdAt,
        amount: Number(p.netAmount),
        status: p.status,
      })),
    };
  }

  async getLoanLedger(tenantId: string, page = 1, limit = 20) {
    const where = {
      tenantId,
      status: { in: ['ACTIVE', 'APPROVED'] },
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
        orderBy: { appliedDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.loan.count({ where }),
    ]);

    const data: LoanLedger[] = loans.map((loan) => ({
      loanId: loan.id,
      loanNumber: loan.loanNumber,
      farmerId: loan.farmerId,
      farmerName: `${loan.farmer.firstName} ${loan.farmer.lastName}`,
      principalAmount: Number(loan.amount),
      interestRate: Number(loan.interestRate),
      tenure: loan.tenure,
      emiAmount: Number(loan.emiAmount),
      totalAmount: Number(loan.amount) + Number(loan.amount) * (Number(loan.interestRate) / 100) * (loan.tenure / 12),
      paidAmount: Number(loan.paidAmount),
      outstandingAmount: Number(loan.outstandingAmount),
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

  async getRepaymentSchedule(tenantId: string, loanId: string): Promise<RepaymentSchedule | null> {
    const loan = await prisma.loan.findFirst({
      where: { id: loanId, tenantId, deletedAt: null },
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
      loanId: loan.id,
      loanNumber: loan.loanNumber,
      installments,
    };
  }

  calculateInterest(principal: number, rate: number, tenure: number): InterestCalculation {
    const monthlyRate = rate / 100 / 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);

    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;

    const monthlyBreakdown = [];
    let balance = principal;

    for (let month = 1; month <= tenure; month++) {
      const interest = balance * monthlyRate;
      const principalPaid = emi - interest;
      balance -= principalPaid;

      monthlyBreakdown.push({
        month,
        principal: principalPaid,
        interest,
        balance: Math.max(0, balance),
      });
    }

    return {
      principalAmount: principal,
      interestRate: rate,
      tenure,
      emiAmount: emi,
      totalInterest,
      totalAmount,
      monthlyBreakdown,
    };
  }

  async getShareContributions(tenantId: string, page = 1, limit = 20) {
    const where = {
      tenantId,
      status: 'ACTIVE',
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

    const data: ShareContribution[] = shares.map((s) => ({
      farmerId: s.farmerId,
      farmerName: `${s.farmer.firstName} ${s.farmer.lastName}`,
      shareCount: s.shareCount,
      shareValue: Number(s.shareValue),
      totalContribution: Number(s.totalValue),
      contributionDate: s.purchaseDate,
      certificateNumber: s.certificateNumber || undefined,
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

  async calculateDividends(tenantId: string, dividendRate: number) {
    const shares = await prisma.share.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        deletedAt: null,
      },
      include: {
        farmer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const taxRate = 0.05;

    const dividends: DividendPayment[] = shares.map((s) => {
      const dividendAmount = Number(s.totalValue) * (dividendRate / 100);
      const taxDeduction = dividendAmount * taxRate;
      const netDividend = dividendAmount - taxDeduction;

      return {
        farmerId: s.farmerId,
        farmerName: `${s.farmer.firstName} ${s.farmer.lastName}`,
        shareCount: s.shareCount,
        dividendRate,
        dividendAmount,
        taxDeduction,
        netDividend,
        status: 'PENDING',
      };
    });

    return dividends;
  }

  async getEmployeeSalaries(tenantId: string, page = 1, limit = 20) {
    const where = {
      tenantId,
      status: 'ACTIVE',
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

    const data: EmployeeSalary[] = employees.map((e) => {
      const basicSalary = Number(e.salary);
      const allowances = 0;
      const deductions = 0;
      const netSalary = basicSalary + allowances - deductions;

      return {
        employeeId: e.id,
        employeeName: `${e.firstName} ${e.lastName}`,
        designation: e.designation,
        basicSalary,
        allowances,
        deductions,
        netSalary,
        status: 'PENDING',
      };
    });

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

  async getFinancialReport(tenantId: string, startDate: Date, endDate: Date): Promise<FinancialReport> {
    const revenue = await prisma.payment.aggregate({
      where: {
        tenantId,
        paymentDate: { gte: startDate, lte: endDate },
        status: 'PAID',
        deletedAt: null,
      },
      _sum: { netAmount: true },
    });

    const salaries = await prisma.employee.aggregate({
      where: {
        tenantId,
        status: 'ACTIVE',
        deletedAt: null,
      },
      _sum: { salary: true },
    });

    const totalRevenue = Number(revenue._sum.netAmount || 0);
    const totalExpenses = Number(salaries._sum.salary || 0);
    const netProfit = totalRevenue - totalExpenses;

    return {
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      totalRevenue,
      totalExpenses,
      netProfit,
      cashFlow: netProfit,
      assets: 0,
      liabilities: 0,
      equity: 0,
    };
  }

  async getCashFlowReport(tenantId: string, startDate: Date, endDate: Date): Promise<CashFlowReport> {
    const receipts = await prisma.payment.aggregate({
      where: {
        tenantId,
        paymentDate: { gte: startDate, lte: endDate },
        status: 'PAID',
        deletedAt: null,
      },
      _sum: { netAmount: true },
    });

    const payments = await prisma.employee.aggregate({
      where: {
        tenantId,
        status: 'ACTIVE',
        deletedAt: null,
      },
      _sum: { salary: true },
    });

    const operating = {
      receipts: Number(receipts._sum.netAmount || 0),
      payments: Number(payments._sum.salary || 0),
      net: Number(receipts._sum.netAmount || 0) - Number(payments._sum.salary || 0),
    };

    return {
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      openingBalance: 0,
      operating,
      investing: { inflows: 0, outflows: 0, net: 0 },
      financing: { inflows: 0, outflows: 0, net: 0 },
      netCashFlow: operating.net,
      closingBalance: operating.net,
    };
  }

  async getRevenueReport(tenantId: string, startDate: Date, endDate: Date): Promise<RevenueReport> {
    const payments = await prisma.payment.findMany({
      where: {
        tenantId,
        paymentDate: { gte: startDate, lte: endDate },
        status: 'PAID',
        deletedAt: null,
      },
      orderBy: { paymentDate: 'asc' },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.netAmount), 0);

    return {
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      milkSales: totalRevenue,
      productSales: 0,
      otherIncome: 0,
      totalRevenue,
      breakdown: payments.map((p) => ({
        date: p.paymentDate!,
        source: 'Milk Sales',
        amount: Number(p.netAmount),
      })),
    };
  }
}
