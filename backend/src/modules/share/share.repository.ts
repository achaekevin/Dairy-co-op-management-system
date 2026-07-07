import prisma from '@database/client.js';
import { Share, Prisma } from '@prisma/client';
import { CreateShareData, UpdateShareData, ShareFilters } from './share.types.js';

class ShareRepository {
  async create(tenantId: string, data: CreateShareData & { totalValue: number }): Promise<Share> {
    return prisma.share.create({
      data: {
        tenantId,
        shareNumber: data.shareNumber,
        farmerId: data.farmerId,
        shareCount: data.shareCount,
        shareValue: data.shareValue,
        totalValue: data.totalValue,
        certificateNumber: data.certificateNumber,
        status: 'ACTIVE',
      },
    });
  }

  async findById(id: string, tenantId: string): Promise<Share | null> {
    return prisma.share.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        farmer: { select: { farmerId: true, firstName: true, lastName: true, phoneNumber: true } },
      },
    });
  }

  async findByShareNumber(shareNumber: string, tenantId: string): Promise<Share | null> {
    return prisma.share.findFirst({
      where: { shareNumber, tenantId, deletedAt: null },
    });
  }

  async update(id: string, _tenantId: string, data: UpdateShareData & { totalValue?: number }): Promise<Share> {
    const updateData: Prisma.ShareUpdateInput = { ...data, updatedAt: new Date() };
    if (data.status) updateData.status = data.status as 'ACTIVE' | 'TRANSFERRED' | 'REDEEMED';
    return prisma.share.update({ where: { id }, data: updateData });
  }

  async softDelete(id: string, _tenantId: string): Promise<void> {
    await prisma.share.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async findAll(
    tenantId: string,
    filters: ShareFilters,
    skip: number,
    take: number,
    orderBy?: Prisma.ShareOrderByWithRelationInput
  ): Promise<Share[]> {
    const where: Prisma.ShareWhereInput = { tenantId, deletedAt: null };
    if (filters.farmerId) where.farmerId = filters.farmerId;
    if (filters.status) where.status = filters.status;
    if (filters.minShares !== undefined || filters.maxShares !== undefined) {
      where.shareCount = {};
      if (filters.minShares !== undefined) where.shareCount.gte = filters.minShares;
      if (filters.maxShares !== undefined) where.shareCount.lte = filters.maxShares;
    }
    if (filters.startDate || filters.endDate) {
      where.purchaseDate = {};
      if (filters.startDate) where.purchaseDate.gte = filters.startDate;
      if (filters.endDate) where.purchaseDate.lte = filters.endDate;
    }
    return prisma.share.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { purchaseDate: 'desc' },
      include: { farmer: { select: { farmerId: true, firstName: true, lastName: true, phoneNumber: true } } },
    });
  }

  async count(tenantId: string, filters: ShareFilters): Promise<number> {
    const where: Prisma.ShareWhereInput = { tenantId, deletedAt: null };
    if (filters.farmerId) where.farmerId = filters.farmerId;
    if (filters.status) where.status = filters.status;
    if (filters.minShares !== undefined || filters.maxShares !== undefined) {
      where.shareCount = {};
      if (filters.minShares !== undefined) where.shareCount.gte = filters.minShares;
      if (filters.maxShares !== undefined) where.shareCount.lte = filters.maxShares;
    }
    return prisma.share.count({ where });
  }

  async getStats(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.ShareWhereInput = { tenantId, deletedAt: null };
    if (startDate || endDate) {
      where.purchaseDate = {};
      if (startDate) where.purchaseDate.gte = startDate;
      if (endDate) where.purchaseDate.lte = endDate;
    }
    const [total, active, transferred, redeemed, shareCountAgg, shareValueAgg, uniqueFarmers] = await Promise.all([
      prisma.share.count({ where }),
      prisma.share.count({ where: { ...where, status: 'ACTIVE' } }),
      prisma.share.count({ where: { ...where, status: 'TRANSFERRED' } }),
      prisma.share.count({ where: { ...where, status: 'REDEEMED' } }),
      prisma.share.aggregate({ where, _sum: { shareCount: true } }),
      prisma.share.aggregate({ where, _sum: { totalValue: true } }),
      prisma.share.groupBy({ where, by: ['farmerId'] }),
    ]);
    return {
      totalShares: total,
      activeShares: active,
      transferredShares: transferred,
      redeemedShares: redeemed,
      totalShareCount: shareCountAgg._sum.shareCount || 0,
      totalShareValue: Number(shareValueAgg._sum.totalValue) || 0,
      totalFarmersWithShares: uniqueFarmers.length,
    };
  }
}

export default new ShareRepository();
