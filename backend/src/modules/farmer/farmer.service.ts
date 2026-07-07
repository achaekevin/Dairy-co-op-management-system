import { ConflictError, NotFoundError } from '@core/errors.js';
import farmerRepository from './farmer.repository.js';
import cacheService from '@shared/services/cache.service.js';
import { Prisma } from '@prisma/client';
import {
  CreateFarmerData,
  UpdateFarmerData,
  FarmerFilters,
  FarmerStats,
  FarmerResponse,
} from './farmer.types.js';
import { Farmer } from '@prisma/client';

class FarmerService {
  async createFarmer(tenantId: string, data: CreateFarmerData): Promise<Farmer> {
    const existingFarmer = await farmerRepository.findByFarmerId(data.farmerId, tenantId);

    if (existingFarmer) {
      throw new ConflictError('Farmer ID already exists');
    }

    const farmer = await farmerRepository.create(tenantId, data);

    await cacheService.deletePattern(`farmers:${tenantId}:*`);

    return farmer;
  }

  async getFarmerById(id: string, tenantId: string): Promise<FarmerResponse> {
    const cacheKey = `farmer:${tenantId}:${id}`;
    const cached = await cacheService.get<FarmerResponse>(cacheKey);

    if (cached) {
      return cached;
    }

    const farmer = await farmerRepository.findById(id, tenantId);

    if (!farmer) {
      throw new NotFoundError('Farmer not found');
    }

    const response = this.formatFarmerResponse(farmer);

    await cacheService.set(cacheKey, response, 3600);

    return response;
  }

  async updateFarmer(
    id: string,
    tenantId: string,
    data: UpdateFarmerData
  ): Promise<Farmer> {
    const farmer = await farmerRepository.findById(id, tenantId);

    if (!farmer) {
      throw new NotFoundError('Farmer not found');
    }

    const updatedFarmer = await farmerRepository.update(id, tenantId, data);

    await cacheService.delete(`farmer:${tenantId}:${id}`);
    await cacheService.deletePattern(`farmers:${tenantId}:*`);

    return updatedFarmer;
  }

  async deleteFarmer(id: string, tenantId: string): Promise<void> {
    const farmer = await farmerRepository.findById(id, tenantId);

    if (!farmer) {
      throw new NotFoundError('Farmer not found');
    }

    await farmerRepository.softDelete(id, tenantId);

    await cacheService.delete(`farmer:${tenantId}:${id}`);
    await cacheService.deletePattern(`farmers:${tenantId}:*`);
  }

  async restoreFarmer(id: string, tenantId: string): Promise<Farmer> {
    const farmer = await farmerRepository.restore(id, tenantId);

    await cacheService.delete(`farmer:${tenantId}:${id}`);
    await cacheService.deletePattern(`farmers:${tenantId}:*`);

    return farmer;
  }

  async listFarmers(
    tenantId: string,
    filters: FarmerFilters,
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ farmers: FarmerResponse[]; total: number }> {
    const cacheKey = `farmers:${tenantId}:${JSON.stringify({ filters, page, limit, sortBy, sortOrder })}`;
    const cached = await cacheService.get<{ farmers: FarmerResponse[]; total: number }>(cacheKey);

    if (cached) {
      return cached;
    }

    const skip = (page - 1) * limit;
    const orderBy: Prisma.FarmerOrderByWithRelationInput = sortBy 
      ? { [sortBy]: sortOrder || 'desc' } 
      : { createdAt: 'desc' };

    const [farmers, total] = await Promise.all([
      farmerRepository.findAll(tenantId, filters, skip, limit, orderBy),
      farmerRepository.count(tenantId, filters),
    ]);

    const formattedFarmers = farmers.map(farmer => this.formatFarmerResponse(farmer));

    const result = { farmers: formattedFarmers, total };

    await cacheService.set(cacheKey, result, 600);

    return result;
  }

  async getFarmerStats(tenantId: string): Promise<FarmerStats> {
    const cacheKey = `farmer:stats:${tenantId}`;
    const cached = await cacheService.get<FarmerStats>(cacheKey);

    if (cached) {
      return cached;
    }

    const stats = await farmerRepository.getStats(tenantId);

    const avgCattlePerFarmer = stats.totalFarmers > 0
      ? Math.round((stats.totalCattle / stats.totalFarmers) * 100) / 100
      : 0;

    const result: FarmerStats = {
      ...stats,
      avgCattlePerFarmer,
    };

    await cacheService.set(cacheKey, result, 1800);

    return result;
  }

  async getVillages(tenantId: string): Promise<string[]> {
    const cacheKey = `farmer:villages:${tenantId}`;
    const cached = await cacheService.get<string[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const villages = await farmerRepository.getVillages(tenantId);

    await cacheService.set(cacheKey, villages, 3600);

    return villages;
  }

  async getDistricts(tenantId: string): Promise<string[]> {
    const cacheKey = `farmer:districts:${tenantId}`;
    const cached = await cacheService.get<string[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const districts = await farmerRepository.getDistricts(tenantId);

    await cacheService.set(cacheKey, districts, 3600);

    return districts;
  }

  private formatFarmerResponse(farmer: Farmer): FarmerResponse {
    return {
      id: farmer.id,
      farmerId: farmer.farmerId,
      firstName: farmer.firstName,
      lastName: farmer.lastName,
      fullName: `${farmer.firstName} ${farmer.lastName}`,
      phoneNumber: farmer.phoneNumber,
      email: farmer.email || undefined,
      status: farmer.status,
      cattle: farmer.cattle,
      totalShares: farmer.totalShares,
      outstandingLoan: Number(farmer.outstandingLoan),
      village: farmer.village || undefined,
      joinDate: farmer.joinDate,
    };
  }
}

export default new FarmerService();
