import prisma from '../../database/client';
import {
  CollectionOfficerDashboardStats,
  FarmerVerification,
  MilkCollectionInput,
  QualityAssessment,
  CollectionReceipt,
  CollectionHistory,
  DailyCollectionReport,
  FarmerCollectionHistory,
} from './collection-officer.types';

export class CollectionOfficerService {
  async getDashboardStats(tenantId: string): Promise<CollectionOfficerDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todaysCollections, farmersServed, totalLitresResult, rejectedMilkResult] =
      await Promise.all([
        prisma.milkCollection.count({
          where: {
            tenantId,
            date: { gte: today },
            deletedAt: null,
          },
        }),
        this.getFarmersServedToday(tenantId, today),
        prisma.milkCollection.aggregate({
          where: {
            tenantId,
            date: { gte: today },
            status: 'ACCEPTED',
            deletedAt: null,
          },
          _sum: { quantity: true },
        }),
        prisma.milkCollection.aggregate({
          where: {
            tenantId,
            date: { gte: today },
            status: 'REJECTED',
            deletedAt: null,
          },
          _sum: { quantity: true },
        }),
      ]);

    const totalLitresCollected = Number(totalLitresResult._sum.quantity || 0);
    const rejectedMilk = Number(rejectedMilkResult._sum.quantity || 0);
    const collectionTarget = 5000;
    const targetProgress = (totalLitresCollected / collectionTarget) * 100;

    return {
      todaysCollections,
      farmersServed,
      totalLitresCollected,
      rejectedMilk,
      collectionTarget,
      targetProgress,
    };
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

  async verifyFarmer(
    tenantId: string,
    searchTerm: string
  ): Promise<FarmerVerification | null> {
    const farmer = await prisma.farmer.findFirst({
      where: {
        tenantId,
        OR: [
          { farmerId: searchTerm },
          { phoneNumber: searchTerm },
          {
            firstName: {
              contains: searchTerm,
            },
          },
          {
            lastName: {
              contains: searchTerm,
            },
          },
        ],
        deletedAt: null,
      },
      include: {
        milkCollections: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    });

    if (!farmer) {
      return null;
    }

    const lastCollection = farmer.milkCollections[0];
    const canDeliver = farmer.status === 'ACTIVE';
    let message = '';

    if (farmer.status === 'SUSPENDED') {
      message = 'Farmer account is suspended. Please contact administration.';
    } else if (farmer.status === 'INACTIVE') {
      message = 'Farmer account is inactive.';
    }

    return {
      farmerId: farmer.id,
      farmerCode: farmer.farmerId,
      firstName: farmer.firstName,
      lastName: farmer.lastName,
      phoneNumber: farmer.phoneNumber || '',
      membershipStatus: farmer.status,
      cattle: farmer.cattle,
      lastCollection: lastCollection
        ? {
            date: lastCollection.date,
            quantity: Number(lastCollection.quantity),
            quality: lastCollection.quality,
          }
        : undefined,
      outstandingBalance: Number(farmer.outstandingLoan),
      canDeliver,
      message: message || undefined,
    };
  }

  async assessQuality(data: {
    temperature: number;
    density?: number;
    fat: number;
    snf: number;
    waterTest?: 'PASS' | 'FAIL';
  }): Promise<QualityAssessment> {
    const { temperature, density, fat, snf, waterTest } = data;

    let temperatureStatus: 'PASS' | 'FAIL' = 'PASS';
    let overallQuality: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR' = 'GOOD';
    let status: 'ACCEPTED' | 'REJECTED' = 'ACCEPTED';
    let reason: string | undefined;

    if (temperature < 2 || temperature > 6) {
      temperatureStatus = 'FAIL';
      status = 'REJECTED';
      reason = 'Temperature out of acceptable range (2-6°C)';
      overallQuality = 'POOR';
    }

    if (waterTest === 'FAIL') {
      status = 'REJECTED';
      reason = 'Water adulteration detected';
      overallQuality = 'POOR';
    }

    if (status === 'ACCEPTED') {
      if (fat >= 6.0 && snf >= 9.0) {
        overallQuality = 'EXCELLENT';
      } else if (fat >= 4.5 && snf >= 8.5) {
        overallQuality = 'GOOD';
      } else if (fat >= 3.5 && snf >= 8.0) {
        overallQuality = 'AVERAGE';
      } else {
        overallQuality = 'POOR';
        status = 'REJECTED';
        reason = 'Fat or SNF below minimum standards';
      }
    }

    return {
      temperature,
      temperatureStatus,
      density,
      fat,
      snf,
      waterTest,
      overallQuality,
      status,
      reason,
    };
  }

  async recordCollection(
    tenantId: string,
    data: MilkCollectionInput
  ): Promise<CollectionReceipt> {
    const qualityAssessment = await this.assessQuality({
      temperature: data.temperature,
      density: data.density,
      fat: data.fat,
      snf: data.snf,
      waterTest: data.waterTest,
    });

    const basePrice = 45;
    const fatPrice = 2;
    const snfPrice = 1.5;

    let rate = basePrice + data.fat * fatPrice + data.snf * snfPrice;

    if (qualityAssessment.overallQuality === 'EXCELLENT') {
      rate += 5;
    } else if (qualityAssessment.overallQuality === 'GOOD') {
      rate += 2;
    }

    const amount = data.quantity * rate;

    const collection = await prisma.milkCollection.create({
      data: {
        tenantId,
        farmerId: data.farmerId,
        date: data.date,
        shift: data.shift,
        quantity: data.quantity,
        fat: data.fat,
        snf: data.snf,
        temperature: data.temperature,
        quality: qualityAssessment.overallQuality,
        status: qualityAssessment.status,
        reason: qualityAssessment.reason,
        collectedBy: data.collectedBy,
        centerId: data.centerId,
        amount,
      },
      include: {
        farmer: {
          select: {
            farmerId: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    const receiptNumber = `RCP-${collection.date.getFullYear()}-${String(
      collection.date.getMonth() + 1
    ).padStart(2, '0')}-${collection.id.substring(0, 8).toUpperCase()}`;

    return {
      receiptNumber,
      date: collection.date,
      shift: collection.shift,
      farmer: {
        farmerId: collection.farmer.farmerId,
        name: `${collection.farmer.firstName} ${collection.farmer.lastName}`,
        phoneNumber: collection.farmer.phoneNumber || '',
      },
      quantity: Number(collection.quantity),
      fat: Number(collection.fat),
      snf: Number(collection.snf),
      quality: collection.quality,
      rate,
      amount: Number(collection.amount),
      centerId: collection.centerId || undefined,
      collectedBy: collection.collectedBy,
      time: collection.createdAt.toLocaleTimeString(),
    };
  }

  async getReceipt(tenantId: string, collectionId: string): Promise<CollectionReceipt | null> {
    const collection = await prisma.milkCollection.findFirst({
      where: {
        id: collectionId,
        tenantId,
        deletedAt: null,
      },
      include: {
        farmer: {
          select: {
            farmerId: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!collection) {
      return null;
    }

    const basePrice = 45;
    const fatPrice = 2;
    const snfPrice = 1.5;

    let rate = basePrice + Number(collection.fat) * fatPrice + Number(collection.snf) * snfPrice;

    if (collection.quality === 'EXCELLENT') {
      rate += 5;
    } else if (collection.quality === 'GOOD') {
      rate += 2;
    }

    const receiptNumber = `RCP-${collection.date.getFullYear()}-${String(
      collection.date.getMonth() + 1
    ).padStart(2, '0')}-${collection.id.substring(0, 8).toUpperCase()}`;

    return {
      receiptNumber,
      date: collection.date,
      shift: collection.shift,
      farmer: {
        farmerId: collection.farmer.farmerId,
        name: `${collection.farmer.firstName} ${collection.farmer.lastName}`,
        phoneNumber: collection.farmer.phoneNumber || '',
      },
      quantity: Number(collection.quantity),
      fat: Number(collection.fat),
      snf: Number(collection.snf),
      quality: collection.quality,
      rate,
      amount: Number(collection.amount),
      centerId: collection.centerId || undefined,
      collectedBy: collection.collectedBy,
      time: collection.createdAt.toLocaleTimeString(),
    };
  }

  async getCollectionHistory(
    tenantId: string,
    date?: Date,
    shift?: 'MORNING' | 'EVENING',
    page = 1,
    limit = 20
  ) {
    const where: any = {
      tenantId,
      deletedAt: null,
    };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      where.date = { gte: startDate, lte: endDate };
    }

    if (shift) {
      where.shift = shift;
    }

    const [collections, total] = await Promise.all([
      prisma.milkCollection.findMany({
        where,
        include: {
          farmer: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.milkCollection.count({ where }),
    ]);

    const data: CollectionHistory[] = collections.map((c) => ({
      id: c.id,
      date: c.date,
      shift: c.shift,
      farmerName: `${c.farmer.firstName} ${c.farmer.lastName}`,
      quantity: Number(c.quantity),
      quality: c.quality,
      amount: Number(c.amount),
      status: c.status,
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

  async getDailyCollectionReport(
    tenantId: string,
    date: Date,
    shift?: 'MORNING' | 'EVENING'
  ): Promise<DailyCollectionReport> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const where: any = {
      tenantId,
      date: { gte: startDate, lte: endDate },
      deletedAt: null,
    };

    if (shift) {
      where.shift = shift;
    }

    const collections = await prisma.milkCollection.findMany({
      where,
    });

    const totalCollections = collections.length;
    const totalFarmers = new Set(collections.map((c) => c.farmerId)).size;
    const totalQuantity = collections.reduce((sum, c) => sum + Number(c.quantity), 0);
    const acceptedQuantity = collections
      .filter((c) => c.status === 'ACCEPTED')
      .reduce((sum, c) => sum + Number(c.quantity), 0);
    const rejectedQuantity = collections
      .filter((c) => c.status === 'REJECTED')
      .reduce((sum, c) => sum + Number(c.quantity), 0);
    const totalAmount = collections.reduce((sum, c) => sum + Number(c.amount), 0);

    const qualityBreakdown = {
      excellent: collections.filter((c) => c.quality === 'EXCELLENT').length,
      good: collections.filter((c) => c.quality === 'GOOD').length,
      average: collections.filter((c) => c.quality === 'AVERAGE').length,
      poor: collections.filter((c) => c.quality === 'POOR').length,
    };

    const centerMap = new Map<string, { quantity: number; farmers: Set<string> }>();

    collections.forEach((c) => {
      const centerId = c.centerId || 'default';
      if (!centerMap.has(centerId)) {
        centerMap.set(centerId, { quantity: 0, farmers: new Set() });
      }
      const center = centerMap.get(centerId)!;
      center.quantity += Number(c.quantity);
      center.farmers.add(c.farmerId);
    });

    const collectionsByCenter = Array.from(centerMap.entries()).map(([centerId, data]) => ({
      centerId,
      quantity: data.quantity,
      farmers: data.farmers.size,
    }));

    return {
      date,
      shift,
      totalCollections,
      totalFarmers,
      totalQuantity,
      acceptedQuantity,
      rejectedQuantity,
      qualityBreakdown,
      totalAmount,
      collectionsByCenter,
    };
  }

  async getFarmerCollectionHistory(
    tenantId: string,
    farmerId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<FarmerCollectionHistory | null> {
    const farmer = await prisma.farmer.findFirst({
      where: {
        id: farmerId,
        tenantId,
        deletedAt: null,
      },
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

    const collections = await prisma.milkCollection.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const totalCollections = collections.length;
    const totalQuantity = collections.reduce((sum, c) => sum + Number(c.quantity), 0);
    const averageQuantity = totalCollections > 0 ? totalQuantity / totalCollections : 0;
    const totalAmount = collections.reduce((sum, c) => sum + Number(c.amount), 0);

    const qualityScores = collections.map((c) => {
      if (c.quality === 'EXCELLENT') return 4;
      if (c.quality === 'GOOD') return 3;
      if (c.quality === 'AVERAGE') return 2;
      return 1;
    });

    const avgScore =
      qualityScores.length > 0
        ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length
        : 0;
    const averageQuality =
      avgScore >= 3.5 ? 'Excellent' : avgScore >= 2.5 ? 'Good' : avgScore >= 1.5 ? 'Average' : 'Poor';

    return {
      farmerId: farmer.id,
      farmerName: `${farmer.firstName} ${farmer.lastName}`,
      totalCollections,
      totalQuantity,
      averageQuantity,
      averageQuality,
      totalAmount,
      lastCollection: collections[0]?.date || new Date(),
      collections: collections.map((c) => ({
        date: c.date,
        shift: c.shift,
        quantity: Number(c.quantity),
        quality: c.quality,
        amount: Number(c.amount),
      })),
    };
  }
}
