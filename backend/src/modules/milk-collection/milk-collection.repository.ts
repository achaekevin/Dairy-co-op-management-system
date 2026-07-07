import prisma from '@database/client.js';
import { MilkCollection, Prisma } from '@prisma/client';
import {
  CreateMilkCollectionData,
  UpdateMilkCollectionData,
  MilkCollectionFilters,
} from './milk-collection.types.js';

class MilkCollectionRepository {
  async create(
    tenantId: string,
    data: CreateMilkCollectionData & { quality: string; amount: number }
  ): Promise<MilkCollection> {
    return prisma.milkCollection.create({
      data: {
        tenantId,
        farmerId: data.farmerId,
        date: data.date,
        shift: data.shift,
        quantity: data.quantity,
        fat: data.fat,
        snf: data.snf,
        temperature: data.temperature,
        quality: data.quality as 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR',
        status: 'ACCEPTED',
        collectedBy: data.collectedBy,
        centerId: data.centerId,
        amount: data.amount,
      },
    });
  }

  async findById(id: string, tenantId: string): Promise<MilkCollection | null> {
    return prisma.milkCollection.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
    });
  }

  async update(
    id: string,
    _tenantId: string,
    data: UpdateMilkCollectionData
  ): Promise<MilkCollection> {
    const updateData: Prisma.MilkCollectionUpdateInput = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.quality) {
      updateData.quality = data.quality as 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
    }

    if (data.status) {
      updateData.status = data.status as 'ACCEPTED' | 'REJECTED';
    }

    return prisma.milkCollection.update({
      where: { id },
      data: updateData,
    });
  }

  async softDelete(id: string, _tenantId: string): Promise<void> {
    await prisma.milkCollection.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findAll(
    tenantId: string,
    filters: MilkCollectionFilters,
    skip: number,
    take: number,
    orderBy?: Prisma.MilkCollectionOrderByWithRelationInput
  ): Promise<Array<MilkCollection & { farmer: { farmerId: string; firstName: string; lastName: string } | null }>> {
    const where: Prisma.MilkCollectionWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (filters.farmerId) {
      where.farmerId = filters.farmerId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.quality) {
      where.quality = filters.quality;
    }

    if (filters.shift) {
      where.shift = filters.shift;
    }

    if (filters.centerId) {
      where.centerId = filters.centerId;
    }

    if (filters.collectedBy) {
      where.collectedBy = filters.collectedBy;
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    if (filters.minQuantity !== undefined || filters.maxQuantity !== undefined) {
      where.quantity = {};
      if (filters.minQuantity !== undefined) {
        where.quantity.gte = filters.minQuantity;
      }
      if (filters.maxQuantity !== undefined) {
        where.quantity.lte = filters.maxQuantity;
      }
    }

    return prisma.milkCollection.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { date: 'desc', createdAt: 'desc' },
      include: {
        farmer: {
          select: {
            farmerId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async count(tenantId: string, filters: MilkCollectionFilters): Promise<number> {
    const where: Prisma.MilkCollectionWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (filters.farmerId) {
      where.farmerId = filters.farmerId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.quality) {
      where.quality = filters.quality;
    }

    if (filters.shift) {
      where.shift = filters.shift;
    }

    if (filters.centerId) {
      where.centerId = filters.centerId;
    }

    if (filters.collectedBy) {
      where.collectedBy = filters.collectedBy;
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    if (filters.minQuantity !== undefined || filters.maxQuantity !== undefined) {
      where.quantity = {};
      if (filters.minQuantity !== undefined) {
        where.quantity.gte = filters.minQuantity;
      }
      if (filters.maxQuantity !== undefined) {
        where.quantity.lte = filters.maxQuantity;
      }
    }

    return prisma.milkCollection.count({ where });
  }

  async getStats(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.MilkCollectionWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = startDate;
      }
      if (endDate) {
        where.date.lte = endDate;
      }
    }

    const [
      total,
      accepted,
      rejected,
      aggregates,
      excellentCount,
      goodCount,
      averageCount,
      poorCount,
    ] = await Promise.all([
      prisma.milkCollection.count({ where }),
      prisma.milkCollection.count({ where: { ...where, status: 'ACCEPTED' } }),
      prisma.milkCollection.count({ where: { ...where, status: 'REJECTED' } }),
      prisma.milkCollection.aggregate({
        where,
        _sum: { quantity: true, amount: true },
        _avg: { fat: true, snf: true, quantity: true },
      }),
      prisma.milkCollection.count({ where: { ...where, quality: 'EXCELLENT' } }),
      prisma.milkCollection.count({ where: { ...where, quality: 'GOOD' } }),
      prisma.milkCollection.count({ where: { ...where, quality: 'AVERAGE' } }),
      prisma.milkCollection.count({ where: { ...where, quality: 'POOR' } }),
    ]);

    return {
      totalCollections: total,
      acceptedCollections: accepted,
      rejectedCollections: rejected,
      totalQuantity: Number(aggregates._sum.quantity) || 0,
      totalAmount: Number(aggregates._sum.amount) || 0,
      avgQuantityPerCollection: Number(aggregates._avg.quantity) || 0,
      avgFat: Number(aggregates._avg.fat) || 0,
      avgSnf: Number(aggregates._avg.snf) || 0,
      excellentQuality: excellentCount,
      goodQuality: goodCount,
      averageQuality: averageCount,
      poorQuality: poorCount,
    };
  }

  async getDailySummary(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<unknown[]> {
    const collections = await prisma.milkCollection.groupBy({
      by: ['date', 'shift'],
      where: {
        tenantId,
        deletedAt: null,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        quantity: true,
        amount: true,
      },
      _count: true,
    });

    return collections;
  }

  async getFarmerSummary(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<unknown[]> {
    const collections = await prisma.milkCollection.groupBy({
      by: ['farmerId'],
      where: {
        tenantId,
        deletedAt: null,
        status: 'ACCEPTED',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        quantity: true,
        amount: true,
      },
      _avg: {
        fat: true,
        snf: true,
      },
      _count: true,
    });

    return collections;
  }

  async checkDuplicateCollection(
    tenantId: string,
    farmerId: string,
    date: Date,
    shift: 'MORNING' | 'EVENING'
  ): Promise<boolean> {
    const existing = await prisma.milkCollection.findFirst({
      where: {
        tenantId,
        farmerId,
        date,
        shift,
        deletedAt: null,
      },
    });

    return !!existing;
  }
}

export default new MilkCollectionRepository();
