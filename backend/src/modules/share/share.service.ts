import { NotFoundError, ConflictError, BadRequestError } from '@core/errors.js';
import shareRepository from './share.repository.js';
import farmerRepository from '@modules/farmer/farmer.repository.js';
import cacheService from '@shared/services/cache.service.js';
import { Prisma } from '@prisma/client';
import { CreateShareData, UpdateShareData, ShareFilters, ShareStats } from './share.types.js';
import { Share } from '@prisma/client';

class ShareService {
  async createShare(tenantId: string, data: CreateShareData): Promise<Share> {
    const farmer = await farmerRepository.findById(data.farmerId, tenantId);
    if (!farmer) throw new NotFoundError('Farmer not found');

    if (farmer.status !== 'ACTIVE') {
      throw new BadRequestError('Farmer is not active');
    }

    const existingShare = await shareRepository.findByShareNumber(data.shareNumber, tenantId);
    if (existingShare) throw new ConflictError('Share number already exists');

    const totalValue = data.shareCount * data.shareValue;

    const share = await shareRepository.create(tenantId, { ...data, totalValue });
    await cacheService.deletePattern(`shares:${tenantId}:*`);
    return share;
  }

  async getShareById(id: string, tenantId: string): Promise<Share> {
    const share = await shareRepository.findById(id, tenantId);
    if (!share) throw new NotFoundError('Share not found');
    return share;
  }

  async updateShare(id: string, tenantId: string, data: UpdateShareData): Promise<Share> {
    const share = await shareRepository.findById(id, tenantId);
    if (!share) throw new NotFoundError('Share not found');

    const updateData: UpdateShareData & { totalValue?: number } = { ...data };

    if (data.shareCount !== undefined || data.shareValue !== undefined) {
      const newShareCount = data.shareCount ?? Number(share.shareCount);
      const newShareValue = data.shareValue ?? Number(share.shareValue);
      updateData.totalValue = newShareCount * newShareValue;
    }

    if (data.status === 'TRANSFERRED' && share.status === 'ACTIVE') {
      if (!data.transferredTo) {
        throw new BadRequestError('transferredTo is required for transfer');
      }
      updateData.transferDate = new Date();
    }

    if (data.status === 'REDEEMED' && share.status === 'ACTIVE') {
      updateData.redemptionDate = new Date();
    }

    const updated = await shareRepository.update(id, tenantId, updateData);
    await cacheService.deletePattern(`shares:${tenantId}:*`);
    return updated;
  }

  async deleteShare(id: string, tenantId: string): Promise<void> {
    const share = await shareRepository.findById(id, tenantId);
    if (!share) throw new NotFoundError('Share not found');

    if (share.status === 'ACTIVE') {
      throw new BadRequestError('Cannot delete an active share. Please redeem or transfer first.');
    }

    await shareRepository.softDelete(id, tenantId);
    await cacheService.deletePattern(`shares:${tenantId}:*`);
  }

  async listShares(
    tenantId: string,
    filters: ShareFilters,
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ shares: Share[]; total: number }> {
    const skip = (page - 1) * limit;
    const orderBy: Prisma.ShareOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || 'desc' }
      : { purchaseDate: 'desc' };
    const [shares, total] = await Promise.all([
      shareRepository.findAll(tenantId, filters, skip, limit, orderBy),
      shareRepository.count(tenantId, filters),
    ]);
    return { shares, total };
  }

  async getShareStats(tenantId: string, startDate?: Date, endDate?: Date): Promise<ShareStats> {
    return shareRepository.getStats(tenantId, startDate, endDate);
  }
}

export default new ShareService();
