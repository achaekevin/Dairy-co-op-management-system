import prisma from '../../database/client';
import {
  StoreOfficerDashboardStats,
  StockLevel,
  StockAdjustment,
  StockTransfer,
  FeedSale,
  SupplierInfo,
  PurchaseRequest,
  GoodsReceived,
  WarehouseInventory,
  DamagedStock,
} from './store-officer.types';

export class StoreOfficerService {
  async getDashboardStats(tenantId: string): Promise<StoreOfficerDashboardStats> {
    const [currentStock, lowStockItems, expiredItems, pendingPurchases, inventoryValue] =
      await Promise.all([
        this.getCurrentStockCount(tenantId),
        this.getLowStockCount(tenantId),
        this.getExpiredItemsCount(tenantId),
        this.getPendingPurchasesCount(tenantId),
        this.getTotalInventoryValue(tenantId),
      ]);

    return {
      currentStock,
      lowStockItems,
      expiredItems,
      pendingPurchases,
      inventoryValue,
    };
  }

  private async getCurrentStockCount(tenantId: string): Promise<number> {
    return prisma.inventory.count({
      where: {
        tenantId,
        quantity: { gt: 0 },
        deletedAt: null,
      },
    });
  }

  private async getLowStockCount(tenantId: string): Promise<number> {
    const items = await prisma.inventory.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      select: {
        quantity: true,
        minStock: true,
      },
    });

    return items.filter((item) => Number(item.quantity) <= Number(item.minStock || 0)).length;
  }

  private async getExpiredItemsCount(tenantId: string): Promise<number> {
    const today = new Date();
    return prisma.inventory.count({
      where: {
        tenantId,
        expiryDate: { lte: today },
        deletedAt: null,
      },
    });
  }

  private async getPendingPurchasesCount(tenantId: string): Promise<number> {
    return prisma.purchaseOrder.count({
      where: {
        tenantId,
        status: 'PENDING',
        deletedAt: null,
      },
    });
  }

  private async getTotalInventoryValue(tenantId: string): Promise<number> {
    const items = await prisma.inventory.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      select: {
        quantity: true,
        unitPrice: true,
      },
    });

    return items.reduce((total, item) => total + Number(item.quantity) * Number(item.unitPrice), 0);
  }

  async getStockLevels(tenantId: string, page = 1, limit = 20, category?: string) {
    const where: any = {
      tenantId,
      deletedAt: null,
    };

    if (category) {
      where.category = category;
    }

    const [items, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        orderBy: { itemName: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inventory.count({ where }),
    ]);

    const data: StockLevel[] = items.map((item) => {
      const currentStock = Number(item.quantity);
      const minStock = Number(item.minStock || 0);
      const maxStock = Number(item.maxStock || 999999);

      let status: StockLevel['status'] = 'IN_STOCK';
      if (item.expiryDate && item.expiryDate <= new Date()) {
        status = 'EXPIRED';
      } else if (currentStock === 0) {
        status = 'OUT_OF_STOCK';
      } else if (currentStock <= minStock) {
        status = 'LOW_STOCK';
      }

      return {
        itemId: item.id,
        itemCode: item.itemCode,
        itemName: item.itemName,
        category: item.category,
        currentStock,
        minStock,
        maxStock,
        unit: item.unit,
        status,
        lastRestocked: item.lastRestocked || undefined,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async adjustStock(tenantId: string, adjustment: StockAdjustment) {
    const item = await prisma.inventory.findFirst({
      where: {
        id: adjustment.itemId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!item) {
      throw new Error('Item not found');
    }

    const currentQuantity = Number(item.quantity);
    const adjustmentQty = adjustment.quantity;

    let newQuantity: number;
    if (adjustment.type === 'ADD') {
      newQuantity = currentQuantity + adjustmentQty;
    } else {
      if (currentQuantity < adjustmentQty) {
        throw new Error('Insufficient stock for removal');
      }
      newQuantity = currentQuantity - adjustmentQty;
    }

    return prisma.inventory.update({
      where: { id: adjustment.itemId },
      data: {
        quantity: newQuantity,
        lastRestocked: adjustment.type === 'ADD' ? new Date() : item.lastRestocked,
      },
    });
  }

  async transferStock(tenantId: string, transfer: StockTransfer) {
    const item = await prisma.inventory.findFirst({
      where: {
        id: transfer.itemId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!item) {
      throw new Error('Item not found');
    }

    const currentQuantity = Number(item.quantity);
    if (currentQuantity < transfer.quantity) {
      throw new Error('Insufficient stock for transfer');
    }

    return prisma.inventory.update({
      where: { id: transfer.itemId },
      data: {
        quantity: currentQuantity - transfer.quantity,
      },
    });
  }

  async recordFeedSale(tenantId: string, sale: FeedSale) {
    const farmer = await prisma.farmer.findFirst({
      where: {
        id: sale.farmerId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    for (const item of sale.items) {
      const inventory = await prisma.inventory.findFirst({
        where: {
          id: item.itemId,
          tenantId,
          deletedAt: null,
        },
      });

      if (!inventory) {
        throw new Error(`Item ${item.itemName} not found`);
      }

      const currentQuantity = Number(inventory.quantity);
      if (currentQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${item.itemName}`);
      }

      await prisma.inventory.update({
        where: { id: item.itemId },
        data: {
          quantity: currentQuantity - item.quantity,
        },
      });
    }

    return { success: true, message: 'Feed sale recorded successfully' };
  }

  async getSuppliers(tenantId: string, page = 1, limit = 20) {
    const where = {
      tenantId,
      deletedAt: null,
    };

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.supplier.count({ where }),
    ]);

    const data: SupplierInfo[] = suppliers.map((s) => ({
      supplierId: s.id,
      supplierCode: s.supplierCode,
      name: s.name,
      contactPerson: s.contactPerson,
      phoneNumber: s.phoneNumber,
      email: s.email || undefined,
      category: s.category,
      totalPurchases: Number(s.totalPurchases || 0),
      outstandingAmount: Number(s.outstandingAmount || 0),
      rating: Number(s.rating || 0),
      status: s.status,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createPurchaseRequest(
    tenantId: string,
    items: { itemName: string; quantity: number; estimatedPrice: number }[],
    requestedBy: string
  ) {
    const requestNumber = `PR-${Date.now()}`;

    return {
      id: `req-${Date.now()}`,
      requestNumber,
      items,
      requestedBy,
      requestDate: new Date(),
      status: 'PENDING' as const,
    };
  }

  async receiveGoods(tenantId: string, goods: GoodsReceived) {
    const po = await prisma.purchaseOrder.findFirst({
      where: {
        orderNumber: goods.poNumber,
        tenantId,
        deletedAt: null,
      },
    });

    if (!po) {
      throw new Error('Purchase order not found');
    }

    await prisma.purchaseOrder.update({
      where: { id: po.id },
      data: {
        status: 'RECEIVED',
      },
    });

    return { success: true, message: 'Goods received successfully' };
  }

  async getWarehouseInventory(tenantId: string) {
    const items = await prisma.inventory.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
    });

    const totalItems = items.length;
    const totalValue = items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
      0
    );

    const data: WarehouseInventory = {
      warehouseId: 'WH-001',
      warehouseName: 'Main Warehouse',
      location: 'Central Store',
      totalItems,
      totalValue,
      capacity: 10000,
      utilization: (totalItems / 10000) * 100,
    };

    return [data];
  }

  async reportDamagedStock(tenantId: string, damaged: Omit<DamagedStock, 'status'>) {
    const item = await prisma.inventory.findFirst({
      where: {
        id: damaged.itemId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!item) {
      throw new Error('Item not found');
    }

    const currentQuantity = Number(item.quantity);
    if (currentQuantity < damaged.quantity) {
      throw new Error('Reported quantity exceeds current stock');
    }

    await prisma.inventory.update({
      where: { id: damaged.itemId },
      data: {
        quantity: currentQuantity - damaged.quantity,
      },
    });

    return {
      ...damaged,
      status: 'REPORTED' as const,
    };
  }

  async getInventoryReport(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: any = {
      tenantId,
      deletedAt: null,
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const items = await prisma.inventory.findMany({
      where,
      orderBy: { itemName: 'asc' },
    });

    const totalValue = items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
      0
    );

    return {
      period: `${startDate?.toLocaleDateString() || 'Beginning'} - ${endDate?.toLocaleDateString() || 'Now'}`,
      totalItems: items.length,
      totalValue,
      items: items.map((item) => ({
        itemCode: item.itemCode,
        itemName: item.itemName,
        category: item.category,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        totalValue: Number(item.quantity) * Number(item.unitPrice),
      })),
    };
  }

  async getPurchaseReport(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: any = {
      tenantId,
      deletedAt: null,
    };

    if (startDate || endDate) {
      where.orderDate = {};
      if (startDate) where.orderDate.gte = startDate;
      if (endDate) where.orderDate.lte = endDate;
    }

    const orders = await prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { orderDate: 'desc' },
    });

    const totalAmount = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

    return {
      period: `${startDate?.toLocaleDateString() || 'Beginning'} - ${endDate?.toLocaleDateString() || 'Now'}`,
      totalOrders: orders.length,
      totalAmount,
      orders: orders.map((order) => ({
        orderNumber: order.orderNumber,
        supplierName: order.supplier.name,
        orderDate: order.orderDate,
        totalAmount: Number(order.totalAmount),
        status: order.status,
      })),
    };
  }

  async getSupplierReport(tenantId: string) {
    const suppliers = await prisma.supplier.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      orderBy: { totalPurchases: 'desc' },
    });

    return {
      totalSuppliers: suppliers.length,
      suppliers: suppliers.map((s) => ({
        supplierCode: s.supplierCode,
        name: s.name,
        category: s.category,
        totalPurchases: Number(s.totalPurchases || 0),
        outstandingAmount: Number(s.outstandingAmount || 0),
        rating: Number(s.rating || 0),
        status: s.status,
      })),
    };
  }
}
