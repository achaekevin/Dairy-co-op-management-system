import prisma from '@database/client.js';
import { InventoryItem, Prisma } from '@prisma/client';
import { CreateInventoryItemData, UpdateInventoryItemData, InventoryFilters } from './inventory.types.js';

class InventoryRepository {
  async create(tenantId: string, data: CreateInventoryItemData & { totalValue: number; status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED' }): Promise<InventoryItem> {
    return prisma.inventoryItem.create({
      data: {
        tenantId,
        ...data,
      },
    });
  }

  async findById(id: string, tenantId: string): Promise<InventoryItem | null> {
    return prisma.inventoryItem.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }

  async findByItemCode(itemCode: string, tenantId: string): Promise<InventoryItem | null> {
    return prisma.inventoryItem.findFirst({
      where: { itemCode, tenantId, deletedAt: null },
    });
  }

  async update(id: string, _tenantId: string, data: UpdateInventoryItemData & { totalValue?: number }): Promise<InventoryItem> {
    const updateData: Prisma.InventoryItemUpdateInput = { ...data, updatedAt: new Date() };
    if (data.category) updateData.category = data.category as 'CATTLE_FEED' | 'MEDICINE' | 'EQUIPMENT' | 'PACKAGING' | 'CLEANING' | 'OTHER';
    if (data.status) updateData.status = data.status as 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED';
    return prisma.inventoryItem.update({ where: { id }, data: updateData });
  }

  async softDelete(id: string, _tenantId: string): Promise<void> {
    await prisma.inventoryItem.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async findAll(
    tenantId: string,
    filters: InventoryFilters,
    skip: number,
    take: number,
    orderBy?: Prisma.InventoryItemOrderByWithRelationInput
  ): Promise<InventoryItem[]> {
    const where: Prisma.InventoryItemWhereInput = { tenantId, deletedAt: null };
    if (filters.category) where.category = filters.category;
    if (filters.status) where.status = filters.status;
    if (filters.location) where.location = { contains: filters.location };
    if (filters.search) {
      where.OR = [
        { itemCode: { contains: filters.search } },
        { itemName: { contains: filters.search } },
        { supplierName: { contains: filters.search } },
      ];
    }
    if (filters.minStock !== undefined || filters.maxStock !== undefined) {
      where.currentStock = {};
      if (filters.minStock !== undefined) where.currentStock.gte = filters.minStock;
      if (filters.maxStock !== undefined) where.currentStock.lte = filters.maxStock;
    }
    return prisma.inventoryItem.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { createdAt: 'desc' },
    });
  }

  async count(tenantId: string, filters: InventoryFilters): Promise<number> {
    const where: Prisma.InventoryItemWhereInput = { tenantId, deletedAt: null };
    if (filters.category) where.category = filters.category;
    if (filters.status) where.status = filters.status;
    if (filters.location) where.location = { contains: filters.location };
    if (filters.search) {
      where.OR = [
        { itemCode: { contains: filters.search } },
        { itemName: { contains: filters.search } },
        { supplierName: { contains: filters.search } },
      ];
    }
    return prisma.inventoryItem.count({ where });
  }

  async getStats(tenantId: string) {
    const where: Prisma.InventoryItemWhereInput = { tenantId, deletedAt: null };
    const [total, inStock, lowStock, outOfStock, expired, valueAgg] = await Promise.all([
      prisma.inventoryItem.count({ where }),
      prisma.inventoryItem.count({ where: { ...where, status: 'IN_STOCK' } }),
      prisma.inventoryItem.count({ where: { ...where, status: 'LOW_STOCK' } }),
      prisma.inventoryItem.count({ where: { ...where, status: 'OUT_OF_STOCK' } }),
      prisma.inventoryItem.count({ where: { ...where, status: 'EXPIRED' } }),
      prisma.inventoryItem.aggregate({ where, _sum: { totalValue: true } }),
    ]);
    return {
      totalItems: total,
      inStockItems: inStock,
      lowStockItems: lowStock,
      outOfStockItems: outOfStock,
      expiredItems: expired,
      totalValue: Number(valueAgg._sum.totalValue) || 0,
    };
  }
}

export default new InventoryRepository();
