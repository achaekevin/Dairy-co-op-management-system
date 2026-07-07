import { NotFoundError, ConflictError } from '@core/errors.js';
import vehicleRepository from './vehicle.repository.js';
import cacheService from '@shared/services/cache.service.js';
import { Prisma } from '@prisma/client';
import { CreateVehicleData, UpdateVehicleData, VehicleFilters, VehicleStats } from './vehicle.types.js';
import { Vehicle } from '@prisma/client';

class VehicleService {
  async createVehicle(tenantId: string, data: CreateVehicleData): Promise<Vehicle> {
    const existing = await vehicleRepository.findByVehicleNumber(data.vehicleNumber, tenantId);
    if (existing) throw new ConflictError('Vehicle number already exists');

    const vehicle = await vehicleRepository.create(tenantId, data);
    await cacheService.deletePattern(`vehicles:${tenantId}:*`);
    return vehicle;
  }

  async getVehicleById(id: string, tenantId: string): Promise<Vehicle> {
    const vehicle = await vehicleRepository.findById(id, tenantId);
    if (!vehicle) throw new NotFoundError('Vehicle not found');
    return vehicle;
  }

  async updateVehicle(id: string, tenantId: string, data: UpdateVehicleData): Promise<Vehicle> {
    const vehicle = await vehicleRepository.findById(id, tenantId);
    if (!vehicle) throw new NotFoundError('Vehicle not found');

    const updated = await vehicleRepository.update(id, tenantId, data);
    await cacheService.deletePattern(`vehicles:${tenantId}:*`);
    return updated;
  }

  async deleteVehicle(id: string, tenantId: string): Promise<void> {
    const vehicle = await vehicleRepository.findById(id, tenantId);
    if (!vehicle) throw new NotFoundError('Vehicle not found');

    await vehicleRepository.softDelete(id, tenantId);
    await cacheService.deletePattern(`vehicles:${tenantId}:*`);
  }

  async listVehicles(
    tenantId: string,
    filters: VehicleFilters,
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ vehicles: Vehicle[]; total: number }> {
    const skip = (page - 1) * limit;
    const orderBy: Prisma.VehicleOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || 'desc' }
      : { createdAt: 'desc' };
    const [vehicles, total] = await Promise.all([
      vehicleRepository.findAll(tenantId, filters, skip, limit, orderBy),
      vehicleRepository.count(tenantId, filters),
    ]);
    return { vehicles, total };
  }

  async getVehicleStats(tenantId: string): Promise<VehicleStats> {
    return vehicleRepository.getStats(tenantId);
  }
}

export default new VehicleService();
