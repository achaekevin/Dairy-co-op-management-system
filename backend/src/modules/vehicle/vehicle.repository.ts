import prisma from '@database/client.js';
import { Vehicle, Prisma } from '@prisma/client';
import { CreateVehicleData, UpdateVehicleData, VehicleFilters } from './vehicle.types.js';

class VehicleRepository {
  async create(tenantId: string, data: CreateVehicleData): Promise<Vehicle> {
    return prisma.vehicle.create({
      data: {
        tenantId,
        ...data,
        currentMileage: data.currentMileage || 0,
        status: 'ACTIVE',
      },
    });
  }

  async findById(id: string, tenantId: string): Promise<Vehicle | null> {
    return prisma.vehicle.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }

  async findByVehicleNumber(vehicleNumber: string, tenantId: string): Promise<Vehicle | null> {
    return prisma.vehicle.findFirst({
      where: { vehicleNumber, tenantId, deletedAt: null },
    });
  }

  async update(id: string, _tenantId: string, data: UpdateVehicleData): Promise<Vehicle> {
    const updateData: Prisma.VehicleUpdateInput = { ...data, updatedAt: new Date() };
    if (data.vehicleType) updateData.vehicleType = data.vehicleType as 'MILK_TANKER' | 'DELIVERY_VAN' | 'TRUCK' | 'CAR' | 'BIKE';
    if (data.fuelType) updateData.fuelType = data.fuelType as 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC';
    if (data.status) updateData.status = data.status as 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
    return prisma.vehicle.update({ where: { id }, data: updateData });
  }

  async softDelete(id: string, _tenantId: string): Promise<void> {
    await prisma.vehicle.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async findAll(
    tenantId: string,
    filters: VehicleFilters,
    skip: number,
    take: number,
    orderBy?: Prisma.VehicleOrderByWithRelationInput
  ): Promise<Vehicle[]> {
    const where: Prisma.VehicleWhereInput = { tenantId, deletedAt: null };
    if (filters.vehicleType) where.vehicleType = filters.vehicleType;
    if (filters.status) where.status = filters.status;
    if (filters.fuelType) where.fuelType = filters.fuelType;
    if (filters.search) {
      where.OR = [
        { vehicleNumber: { contains: filters.search } },
        { brand: { contains: filters.search } },
        { model: { contains: filters.search } },
        { driverName: { contains: filters.search } },
      ];
    }
    return prisma.vehicle.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { createdAt: 'desc' },
    });
  }

  async count(tenantId: string, filters: VehicleFilters): Promise<number> {
    const where: Prisma.VehicleWhereInput = { tenantId, deletedAt: null };
    if (filters.vehicleType) where.vehicleType = filters.vehicleType;
    if (filters.status) where.status = filters.status;
    if (filters.fuelType) where.fuelType = filters.fuelType;
    if (filters.search) {
      where.OR = [
        { vehicleNumber: { contains: filters.search } },
        { brand: { contains: filters.search } },
        { model: { contains: filters.search } },
        { driverName: { contains: filters.search } },
      ];
    }
    return prisma.vehicle.count({ where });
  }

  async getStats(tenantId: string) {
    const where: Prisma.VehicleWhereInput = { tenantId, deletedAt: null };
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const [total, active, maintenance, inactive, insuranceExpiring, fitnessExpiring] = await Promise.all([
      prisma.vehicle.count({ where }),
      prisma.vehicle.count({ where: { ...where, status: 'ACTIVE' } }),
      prisma.vehicle.count({ where: { ...where, status: 'MAINTENANCE' } }),
      prisma.vehicle.count({ where: { ...where, status: 'INACTIVE' } }),
      prisma.vehicle.count({ where: { ...where, insuranceExpiry: { lte: thirtyDaysFromNow } } }),
      prisma.vehicle.count({ where: { ...where, fitnessExpiry: { lte: thirtyDaysFromNow } } }),
    ]);
    return {
      totalVehicles: total,
      activeVehicles: active,
      maintenanceVehicles: maintenance,
      inactiveVehicles: inactive,
      expiringSoonInsurance: insuranceExpiring,
      expiringSoonFitness: fitnessExpiring,
    };
  }
}

export default new VehicleRepository();
