import prisma from '@database/client.js';
import { Farmer, Prisma } from '@prisma/client';
import { CreateFarmerData, UpdateFarmerData, FarmerFilters } from './farmer.types.js';

class FarmerRepository {
  async create(tenantId: string, data: CreateFarmerData): Promise<Farmer> {
    return prisma.farmer.create({
      data: {
        tenantId,
        ...data,
      },
    });
  }

  async findById(id: string, tenantId: string): Promise<Farmer | null> {
    return prisma.farmer.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
    });
  }

  async findByFarmerId(farmerId: string, tenantId: string): Promise<Farmer | null> {
    return prisma.farmer.findFirst({
      where: {
        farmerId,
        tenantId,
        deletedAt: null,
      },
    });
  }

  async update(id: string, _tenantId: string, data: UpdateFarmerData): Promise<Farmer> {
    return prisma.farmer.update({
      where: {
        id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async softDelete(id: string, _tenantId: string): Promise<void> {
    await prisma.farmer.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    });
  }

  async restore(id: string, _tenantId: string): Promise<Farmer> {
    return prisma.farmer.update({
      where: { id },
      data: {
        deletedAt: null,
        status: 'ACTIVE',
      },
    });
  }

  async findAll(
    tenantId: string,
    filters: FarmerFilters,
    skip: number,
    take: number,
    orderBy?: Prisma.FarmerOrderByWithRelationInput
  ): Promise<Farmer[]> {
    const where: Prisma.FarmerWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { farmerId: { contains: filters.search } },
        { phoneNumber: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.village) {
      where.village = { contains: filters.village };
    }

    if (filters.district) {
      where.district = { contains: filters.district };
    }

    if (filters.minCattle !== undefined || filters.maxCattle !== undefined) {
      where.cattle = {};
      if (filters.minCattle !== undefined) {
        where.cattle.gte = filters.minCattle;
      }
      if (filters.maxCattle !== undefined) {
        where.cattle.lte = filters.maxCattle;
      }
    }

    if (filters.hasOutstandingLoan !== undefined) {
      if (filters.hasOutstandingLoan) {
        where.outstandingLoan = { gt: 0 };
      } else {
        where.outstandingLoan = 0;
      }
    }

    return prisma.farmer.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { createdAt: 'desc' },
    });
  }

  async count(tenantId: string, filters: FarmerFilters): Promise<number> {
    const where: Prisma.FarmerWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { farmerId: { contains: filters.search } },
        { phoneNumber: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.village) {
      where.village = { contains: filters.village };
    }

    if (filters.district) {
      where.district = { contains: filters.district };
    }

    if (filters.minCattle !== undefined || filters.maxCattle !== undefined) {
      where.cattle = {};
      if (filters.minCattle !== undefined) {
        where.cattle.gte = filters.minCattle;
      }
      if (filters.maxCattle !== undefined) {
        where.cattle.lte = filters.maxCattle;
      }
    }

    if (filters.hasOutstandingLoan !== undefined) {
      if (filters.hasOutstandingLoan) {
        where.outstandingLoan = { gt: 0 };
      } else {
        where.outstandingLoan = 0;
      }
    }

    return prisma.farmer.count({ where });
  }

  async getStats(tenantId: string): Promise<{
    totalFarmers: number;
    activeFarmers: number;
    inactiveFarmers: number;
    suspendedFarmers: number;
    totalCattle: number;
    totalOutstandingLoans: number;
    totalShares: number;
  }> {
    const [
      total,
      active,
      inactive,
      suspended,
      cattleSum,
      loanSum,
      shareSum,
    ] = await Promise.all([
      prisma.farmer.count({
        where: { tenantId, deletedAt: null },
      }),
      prisma.farmer.count({
        where: { tenantId, deletedAt: null, status: 'ACTIVE' },
      }),
      prisma.farmer.count({
        where: { tenantId, deletedAt: null, status: 'INACTIVE' },
      }),
      prisma.farmer.count({
        where: { tenantId, deletedAt: null, status: 'SUSPENDED' },
      }),
      prisma.farmer.aggregate({
        where: { tenantId, deletedAt: null },
        _sum: { cattle: true },
      }),
      prisma.farmer.aggregate({
        where: { tenantId, deletedAt: null },
        _sum: { outstandingLoan: true },
      }),
      prisma.farmer.aggregate({
        where: { tenantId, deletedAt: null },
        _sum: { totalShares: true },
      }),
    ]);

    return {
      totalFarmers: total,
      activeFarmers: active,
      inactiveFarmers: inactive,
      suspendedFarmers: suspended,
      totalCattle: cattleSum._sum.cattle || 0,
      totalOutstandingLoans: Number(loanSum._sum.outstandingLoan) || 0,
      totalShares: shareSum._sum.totalShares || 0,
    };
  }

  async getVillages(tenantId: string): Promise<string[]> {
    const farmers = await prisma.farmer.findMany({
      where: {
        tenantId,
        deletedAt: null,
        village: { not: null },
      },
      select: { village: true },
      distinct: ['village'],
    });

    return farmers.map(f => f.village).filter(Boolean) as string[];
  }

  async getDistricts(tenantId: string): Promise<string[]> {
    const farmers = await prisma.farmer.findMany({
      where: {
        tenantId,
        deletedAt: null,
        district: { not: null },
      },
      select: { district: true },
      distinct: ['district'],
    });

    return farmers.map(f => f.district).filter(Boolean) as string[];
  }
}

export default new FarmerRepository();
