import { ConflictError, NotFoundError, BadRequestError } from '@core/errors.js';
import milkCollectionRepository from './milk-collection.repository.js';
import farmerRepository from '@modules/farmer/farmer.repository.js';
import cacheService from '@shared/services/cache.service.js';
import { Prisma } from '@prisma/client';
import {
  CreateMilkCollectionData,
  UpdateMilkCollectionData,
  MilkCollectionFilters,
  MilkCollectionStats,
  DailyCollectionSummary,
  FarmerCollectionSummary,
  MilkCollectionResponse,
} from './milk-collection.types.js';
import { MilkCollection } from '@prisma/client';

class MilkCollectionService {
  async createMilkCollection(
    tenantId: string,
    data: CreateMilkCollectionData
  ): Promise<MilkCollection> {
    const farmer = await farmerRepository.findById(data.farmerId, tenantId);
    if (!farmer) {
      throw new NotFoundError('Farmer not found');
    }

    if (farmer.status !== 'ACTIVE') {
      throw new BadRequestError('Farmer is not active');
    }

    const isDuplicate = await milkCollectionRepository.checkDuplicateCollection(
      tenantId,
      data.farmerId,
      data.date,
      data.shift
    );

    if (isDuplicate) {
      throw new ConflictError(`Milk collection already exists for this farmer on ${data.date.toDateString()} ${data.shift} shift`);
    }

    const quality = this.calculateQuality(data.fat, data.snf);
    const amount = this.calculateAmount(data.quantity, data.fat, data.snf);

    const collection = await milkCollectionRepository.create(tenantId, {
      ...data,
      quality,
      amount,
    });

    await cacheService.deletePattern(`milk-collections:${tenantId}:*`);

    return collection;
  }

  async getMilkCollectionById(
    id: string,
    tenantId: string
  ): Promise<MilkCollectionResponse> {
    const cacheKey = `milk-collection:${tenantId}:${id}`;
    const cached = await cacheService.get<MilkCollectionResponse>(cacheKey);

    if (cached) {
      return cached;
    }

    const collection = await milkCollectionRepository.findById(id, tenantId);

    if (!collection) {
      throw new NotFoundError('Milk collection not found');
    }

    const farmer = await farmerRepository.findById(collection.farmerId, tenantId);

    const response = this.formatCollectionResponse(collection, farmer);

    await cacheService.set(cacheKey, response, 1800);

    return response;
  }

  async updateMilkCollection(
    id: string,
    tenantId: string,
    data: UpdateMilkCollectionData
  ): Promise<MilkCollection> {
    const collection = await milkCollectionRepository.findById(id, tenantId);

    if (!collection) {
      throw new NotFoundError('Milk collection not found');
    }

    const updatedCollection = await milkCollectionRepository.update(id, tenantId, data);

    await cacheService.delete(`milk-collection:${tenantId}:${id}`);
    await cacheService.deletePattern(`milk-collections:${tenantId}:*`);

    return updatedCollection;
  }

  async deleteMilkCollection(id: string, tenantId: string): Promise<void> {
    const collection = await milkCollectionRepository.findById(id, tenantId);

    if (!collection) {
      throw new NotFoundError('Milk collection not found');
    }

    await milkCollectionRepository.softDelete(id, tenantId);

    await cacheService.delete(`milk-collection:${tenantId}:${id}`);
    await cacheService.deletePattern(`milk-collections:${tenantId}:*`);
  }

  async listMilkCollections(
    tenantId: string,
    filters: MilkCollectionFilters,
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ collections: MilkCollectionResponse[]; total: number }> {
    const cacheKey = `milk-collections:${tenantId}:${JSON.stringify({ filters, page, limit, sortBy, sortOrder })}`;
    const cached = await cacheService.get<{ collections: MilkCollectionResponse[]; total: number }>(cacheKey);

    if (cached) {
      return cached;
    }

    const skip = (page - 1) * limit;
    const orderBy: Prisma.MilkCollectionOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || 'desc' }
      : { date: 'desc', createdAt: 'desc' };

    const [collections, total] = await Promise.all([
      milkCollectionRepository.findAll(tenantId, filters, skip, limit, orderBy),
      milkCollectionRepository.count(tenantId, filters),
    ]);

    const formattedCollections = await Promise.all(
      collections.map(async (collection) => {
        const farmer = collection.farmer || null;
        return this.formatCollectionResponse(collection, farmer);
      })
    );

    const result = { collections: formattedCollections, total };

    await cacheService.set(cacheKey, result, 300);

    return result;
  }

  async getMilkCollectionStats(
    tenantId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<MilkCollectionStats> {
    const cacheKey = `milk-collection:stats:${tenantId}:${startDate?.toISOString()}:${endDate?.toISOString()}`;
    const cached = await cacheService.get<MilkCollectionStats>(cacheKey);

    if (cached) {
      return cached;
    }

    const stats = await milkCollectionRepository.getStats(tenantId, startDate, endDate);

    await cacheService.set(cacheKey, stats, 900);

    return stats;
  }

  async getDailySummary(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DailyCollectionSummary[]> {
    const cacheKey = `milk-collection:daily:${tenantId}:${startDate.toISOString()}:${endDate.toISOString()}`;
    const cached = await cacheService.get<DailyCollectionSummary[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const collections = await milkCollectionRepository.getDailySummary(tenantId, startDate, endDate);

    const summary = this.aggregateDailySummary(collections);

    await cacheService.set(cacheKey, summary, 1800);

    return summary;
  }

  async getFarmerSummary(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<FarmerCollectionSummary[]> {
    const cacheKey = `milk-collection:farmer-summary:${tenantId}:${startDate.toISOString()}:${endDate.toISOString()}`;
    const cached = await cacheService.get<FarmerCollectionSummary[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const collections = await milkCollectionRepository.getFarmerSummary(tenantId, startDate, endDate);

    const summary = await this.aggregateFarmerSummary(tenantId, collections);

    await cacheService.set(cacheKey, summary, 1800);

    return summary;
  }

  private calculateQuality(fat: number, snf: number): string {
    const combinedScore = fat + snf;

    if (fat >= 4.5 && snf >= 8.5 && combinedScore >= 14) {
      return 'EXCELLENT';
    } else if (fat >= 3.5 && snf >= 8.0 && combinedScore >= 12) {
      return 'GOOD';
    } else if (fat >= 3.0 && snf >= 7.5 && combinedScore >= 10.5) {
      return 'AVERAGE';
    } else {
      return 'POOR';
    }
  }

  private calculateAmount(quantity: number, fat: number, snf: number): number {
    const baseRate = 30;
    const fatBonus = (fat - 3) * 2;
    const snfBonus = (snf - 8) * 1.5;
    const ratePerLiter = baseRate + fatBonus + snfBonus;

    return Math.round(quantity * ratePerLiter * 100) / 100;
  }

  private formatCollectionResponse(
    collection: MilkCollection,
    farmer?: { farmerId: string; firstName: string; lastName: string } | null
  ): MilkCollectionResponse {
    return {
      id: collection.id,
      farmerId: collection.farmerId,
      farmerName: farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
      date: collection.date,
      shift: collection.shift,
      quantity: Number(collection.quantity),
      fat: Number(collection.fat),
      snf: Number(collection.snf),
      temperature: collection.temperature ? Number(collection.temperature) : undefined,
      quality: collection.quality,
      status: collection.status,
      reason: collection.reason || undefined,
      amount: Number(collection.amount),
      collectedBy: collection.collectedBy,
      centerId: collection.centerId || undefined,
      createdAt: collection.createdAt,
    };
  }

  private aggregateDailySummary(collections: unknown[]): DailyCollectionSummary[] {
    const dailyMap = new Map<string, DailyCollectionSummary>();

    for (const collection of collections as Array<{
      date: Date;
      shift: string;
      _sum: { quantity: number | null; amount: number | null };
      _count: number;
    }>) {
      const dateKey = collection.date.toISOString().split('T')[0];

      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          date: dateKey,
          morningQuantity: 0,
          eveningQuantity: 0,
          totalQuantity: 0,
          morningAmount: 0,
          eveningAmount: 0,
          totalAmount: 0,
          totalCollections: 0,
        });
      }

      const summary = dailyMap.get(dateKey)!;
      const quantity = Number(collection._sum.quantity) || 0;
      const amount = Number(collection._sum.amount) || 0;

      if (collection.shift === 'MORNING') {
        summary.morningQuantity += quantity;
        summary.morningAmount += amount;
      } else {
        summary.eveningQuantity += quantity;
        summary.eveningAmount += amount;
      }

      summary.totalQuantity += quantity;
      summary.totalAmount += amount;
      summary.totalCollections += collection._count;
    }

    return Array.from(dailyMap.values()).sort((a, b) => b.date.localeCompare(a.date));
  }

  private async aggregateFarmerSummary(
    tenantId: string,
    collections: unknown[]
  ): Promise<FarmerCollectionSummary[]> {
    const summaries: FarmerCollectionSummary[] = [];

    for (const collection of collections as Array<{
      farmerId: string;
      _sum: { quantity: number | null; amount: number | null };
      _avg: { fat: number | null; snf: number | null };
      _count: number;
    }>) {
      const farmer = await farmerRepository.findById(collection.farmerId, tenantId);

      summaries.push({
        farmerId: collection.farmerId,
        farmerName: farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown',
        totalQuantity: Number(collection._sum.quantity) || 0,
        totalAmount: Number(collection._sum.amount) || 0,
        avgFat: Number(collection._avg.fat) || 0,
        avgSnf: Number(collection._avg.snf) || 0,
        collectionsCount: collection._count,
      });
    }

    return summaries.sort((a, b) => b.totalQuantity - a.totalQuantity);
  }
}

export default new MilkCollectionService();
