import { NotFoundError, ConflictError } from '@core/errors.js';
import inventoryRepository from './inventory.repository.js';
import cacheService from '@shared/services/cache.service.js';
import { Prisma } from '@prisma/client';
import { CreateInventoryItemData, UpdateInventoryItemData, InventoryFilters, InventoryStats } from './inventory.types.js';
import { InventoryItem } from '@prisma/client';

class InventoryService {
  async createInventoryItem(tenantId: string, data: CreateInventoryItemData): Promise<InventoryItem> {
    const existing = await inventoryRepository.findByItemCode(data.itemCode, tenantId);
    if (existing) throw new ConflictError('Item code already exists');

    const totalValue = data.currentStock * data.unitPrice;
    const status = this.determineStatus(data.currentStock, data.minStock, data.expiryDate);

    const item = await inventoryRepository.create(tenantId, { ...data, totalValue, status });
    await cacheService.deletePattern(`inventory:${tenantId}:*`);
    return item;
  }

  async getInventoryItemById(id: string, tenantId: string): Promise<InventoryItem> {
    const item = await inventoryRepository.findById(id, tenantId);
    if (!item) throw new NotFoundError('Inventory item not found');
    return item;
  }

  async updateInventoryItem(id: string, tenantId: string, data: UpdateInventoryItemData): Promise<InventoryItem> {
    const item = await inventoryRepository.findById(id, tenantId);
    if (!item) throw new NotFoundError('Inventory item not found');

    const updateData: UpdateInventoryItemData & { totalValue?: number } = { ...data };

    if (data.currentStock !== undefined || data.unitPrice !== undefined) {
      const newStock = data.currentStock ?? Number(item.currentStock);
      const newPrice = data.unitPrice ?? Number(item.unitPrice);
      updateData.totalValue = newStock * newPrice;

      const minStock = data.minStock ?? Number(item.minStock);
      const expiryDate = data.expiryDate ?? item.expiryDate;
      updateData.status = this.determineStatus(newStock, minStock, expiryDate);
    }

    const updated = await inventoryRepository.update(id, tenantId, updateData);
    await cacheService.deletePattern(`inventory:${tenantId}:*`);
    return updated;
  }

  async deleteInventoryItem(id: string, tenantId: string): Promise<void> {
    const item = await inventoryRepository.findById(id, tenantId);
    if (!item) throw new NotFoundError('Inventory item not found');

    await inventoryRepository.softDelete(id, tenantId);
    await cacheService.deletePattern(`inventory:${tenantId}:*`);
  }

  async listInventoryItems(
    tenantId: string,
    filters: InventoryFilters,
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ items: InventoryItem[]; total: number }> {
    const skip = (page - 1) * limit;
    const orderBy: Prisma.InventoryItemOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || 'desc' }
      : { createdAt: 'desc' };
    const [items, total] = await Promise.all([
      inventoryRepository.findAll(tenantId, filters, skip, limit, orderBy),
      inventoryRepository.count(tenantId, filters),
    ]);
    return { items, total };
  }

  async getInventoryStats(tenantId: string): Promise<InventoryStats> {
    return inventoryRepository.getStats(tenantId);
  }

  private determineStatus(currentStock: number, minStock: number, expiryDate?: Date | null): 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED' {
    if (expiryDate && new Date(expiryDate) < new Date()) return 'EXPIRED';
    if (currentStock === 0) return 'OUT_OF_STOCK';
    if (currentStock <= minStock) return 'LOW_STOCK';
    return 'IN_STOCK';
  }
}

export default new InventoryService();
