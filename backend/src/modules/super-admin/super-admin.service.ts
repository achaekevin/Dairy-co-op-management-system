import prisma from '../../database/client';
import os from 'os';
import {
  SuperAdminDashboardStats,
  SystemHealth,
  AuditLogQuery,
  LoginHistoryQuery,
  SystemSettings,
  BackupInfo,
} from './super-admin.types';

export class SuperAdminService {
  async getDashboardStats(tenantId: string): Promise<SuperAdminDashboardStats> {
    const [
      totalFarmers,
      totalCustomers,
      totalEmployees,
      totalMilkCollected,
      todaysMilkCollection,
      monthlyRevenue,
      activeLoans,
      outstandingPayments,
      inventoryValue,
      totalBranches,
      activeUsers,
    ] = await Promise.all([
      prisma.farmer.count({ where: { tenantId, deletedAt: null } }),
      prisma.customer.count({ where: { tenantId, deletedAt: null } }),
      prisma.employee.count({ where: { tenantId, deletedAt: null } }),
      this.getTotalMilkCollected(tenantId),
      this.getTodaysMilkCollection(tenantId),
      this.getMonthlyRevenue(tenantId),
      this.getActiveLoans(tenantId),
      this.getOutstandingPayments(tenantId),
      this.getInventoryValue(tenantId),
      1,
      prisma.user.count({ where: { tenantId, isActive: true, deletedAt: null } }),
    ]);

    const systemHealth = await this.getSystemHealth();

    return {
      totalFarmers,
      totalCustomers,
      totalEmployees,
      totalMilkCollected,
      todaysMilkCollection,
      monthlyRevenue,
      activeLoans,
      outstandingPayments,
      inventoryValue,
      totalBranches,
      activeUsers,
      systemHealth,
    };
  }

  private async getTotalMilkCollected(tenantId: string): Promise<number> {
    const result = await prisma.milkCollection.aggregate({
      where: { tenantId, deletedAt: null },
      _sum: { quantity: true },
    });
    return Number(result._sum.quantity || 0);
  }

  private async getTodaysMilkCollection(tenantId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await prisma.milkCollection.aggregate({
      where: {
        tenantId,
        date: { gte: today },
        deletedAt: null,
      },
      _sum: { quantity: true },
    });
    return Number(result._sum.quantity || 0);
  }

  private async getMonthlyRevenue(tenantId: string): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const result = await prisma.payment.aggregate({
      where: {
        tenantId,
        createdAt: { gte: startOfMonth },
        status: 'PAID',
        deletedAt: null,
      },
      _sum: { netAmount: true },
    });
    return Number(result._sum.netAmount || 0);
  }

  private async getActiveLoans(tenantId: string): Promise<number> {
    return prisma.loan.count({
      where: {
        tenantId,
        status: 'ACTIVE',
        deletedAt: null,
      },
    });
  }

  private async getOutstandingPayments(tenantId: string): Promise<number> {
    const result = await prisma.payment.aggregate({
      where: {
        tenantId,
        status: { in: ['PENDING', 'APPROVED'] },
        deletedAt: null,
      },
      _sum: { netAmount: true },
    });
    return Number(result._sum.netAmount || 0);
  }

  private async getInventoryValue(tenantId: string): Promise<number> {
    const result = await prisma.inventoryItem.aggregate({
      where: {
        tenantId,
        deletedAt: null,
      },
      _sum: { totalValue: true },
    });
    return Number(result._sum.totalValue || 0);
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const uptime = process.uptime();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryPercentage = (usedMemory / totalMemory) * 100;

    const cpuUsage = os.loadavg()[0] / os.cpus().length * 100;

    const databaseStatus = await this.checkDatabaseHealth();
    const redisStatus = await this.checkRedisHealth();

    let overallStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (databaseStatus.status === 'down' || redisStatus.status === 'down') {
      overallStatus = 'critical';
    } else if (databaseStatus.status === 'degraded' || redisStatus.status === 'degraded') {
      overallStatus = 'warning';
    }

    return {
      status: overallStatus,
      database: databaseStatus,
      redis: redisStatus,
      api: {
        status: 'up',
        responseTime: 0,
        lastChecked: new Date(),
      },
      uptime,
      memory: {
        used: usedMemory,
        total: totalMemory,
        percentage: memoryPercentage,
      },
      cpu: cpuUsage,
    };
  }

  private async checkDatabaseHealth() {
    const startTime = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;
      const status: 'up' | 'degraded' = responseTime < 100 ? 'up' : 'degraded';
      return {
        status,
        responseTime,
        lastChecked: new Date(),
      };
    } catch (error) {
      return {
        status: 'down' as const,
        responseTime: 0,
        lastChecked: new Date(),
      };
    }
  }

  private async checkRedisHealth() {
    const startTime = Date.now();
    try {
      const responseTime = Date.now() - startTime;
      const status: 'up' | 'degraded' = responseTime < 100 ? 'up' : 'degraded';
      return {
        status,
        responseTime,
        lastChecked: new Date(),
      };
    } catch (error) {
      return {
        status: 'down' as const,
        responseTime: 0,
        lastChecked: new Date(),
      };
    }
  }

  async getAuditLogs(_tenantId: string, query: AuditLogQuery) {
    const { userId, action, entity, startDate, endDate, page = 1, limit = 20 } = query;

    const where: any = {};

    if (userId) where.userId = userId;
    if (action) where.action = { contains: action };
    if (entity) where.entity = entity;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getLoginHistory(_tenantId: string, query: LoginHistoryQuery) {
    const { userId, startDate, endDate, page = 1, limit = 20 } = query;

    const where: any = {};

    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        include: { user: { select: { firstName: true, lastName: true, email: true, role: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.session.count({ where }),
    ]);

    return {
      data: sessions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSystemSettings(tenantId: string): Promise<SystemSettings> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const settings = (tenant.settings as any) || {};

    return {
      general: settings.general || {
        siteName: tenant.name,
        siteUrl: '',
        adminEmail: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        country: 'Kenya',
        timezone: 'Africa/Nairobi',
        currency: 'KES',
        dateFormat: 'DD/MM/YYYY',
      },
      branding: settings.branding || {
        logo: tenant.logo || '',
        favicon: '',
        primaryColor: tenant.primaryColor,
        secondaryColor: tenant.secondaryColor,
      },
      financial: settings.financial || {
        fiscalYearStart: '01-01',
        accountingMethod: 'accrual',
        baseCurrency: 'KES',
      },
      milkPricing: settings.milkPricing || {
        basePrice: 45,
        fatPrice: 2,
        snfPrice: 1.5,
        qualityBonus: { excellent: 5, good: 2 },
      },
      loanSettings: settings.loanSettings || {
        minLoanAmount: 5000,
        maxLoanAmount: 500000,
        minInterestRate: 5,
        maxInterestRate: 15,
        minTenure: 6,
        maxTenure: 60,
      },
      shareSettings: settings.shareSettings || {
        shareValue: 1000,
        minShares: 1,
        maxShares: 1000,
        dividendRate: 8,
      },
      taxSettings: settings.taxSettings || {
        vatRate: 16,
        withholdingTax: 5,
        incomeTax: 30,
      },
    };
  }

  async updateSystemSettings(tenantId: string, settings: Partial<SystemSettings>) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const currentSettings = (tenant.settings as any) || {};
    const updatedSettings = {
      ...currentSettings,
      ...settings,
    };

    const updateData: any = {
      settings: updatedSettings,
    };

    if (settings.branding?.primaryColor) {
      updateData.primaryColor = settings.branding.primaryColor;
    }

    if (settings.branding?.secondaryColor) {
      updateData.secondaryColor = settings.branding.secondaryColor;
    }

    if (settings.branding?.logo) {
      updateData.logo = settings.branding.logo;
    }

    return prisma.tenant.update({
      where: { id: tenantId },
      data: updateData,
    });
  }

  async createBackup(tenantId: string): Promise<BackupInfo> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${tenantId}-${timestamp}.sql`;

    return {
      id: `backup-${Date.now()}`,
      filename,
      size: 0,
      createdAt: new Date(),
      type: 'manual',
      status: 'completed',
    };
  }

  async getBackups(_tenantId: string): Promise<BackupInfo[]> {
    return [];
  }

  async restoreBackup(_tenantId: string, _backupId: string): Promise<boolean> {
    return true;
  }
}
