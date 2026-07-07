import { NotFoundError, ConflictError, BadRequestError } from '@core/errors.js';
import purchaseOrderRepository from './purchase-order.repository.js';
import supplierRepository from '@modules/supplier/supplier.repository.js';
import cacheService from '@shared/services/cache.service.js';
import { Prisma } from '@prisma/client';
import { CreatePurchaseOrderData, UpdatePurchaseOrderData, PurchaseOrderFilters, PurchaseOrderStats } from './purchase-order.types.js';
import { PurchaseOrder } from '@prisma/client';

class PurchaseOrderService {
  async createPurchaseOrder(tenantId: string, data: CreatePurchaseOrderData): Promise<PurchaseOrder> {
    const supplier = await supplierRepository.findById(data.supplierId, tenantId);
    if (!supplier) throw new NotFoundError('Supplier not found');

    const existing = await purchaseOrderRepository.findByPoNumber(data.poNumber, tenantId);
    if (existing) throw new ConflictError('Purchase order number already exists');

    const balanceAmount = data.totalAmount;

    const po = await purchaseOrderRepository.create(tenantId, { ...data, balanceAmount });
    await cacheService.deletePattern(`purchase-orders:${tenantId}:*`);
    return po;
  }

  async getPurchaseOrderById(id: string, tenantId: string): Promise<PurchaseOrder> {
    const po = await purchaseOrderRepository.findById(id, tenantId);
    if (!po) throw new NotFoundError('Purchase order not found');
    return po;
  }

  async updatePurchaseOrder(id: string, tenantId: string, data: UpdatePurchaseOrderData): Promise<PurchaseOrder> {
    const po = await purchaseOrderRepository.findById(id, tenantId);
    if (!po) throw new NotFoundError('Purchase order not found');

    if (data.status === 'CANCELLED' && po.status !== 'DRAFT') {
      throw new BadRequestError('Only draft orders can be cancelled');
    }

    if (data.status === 'DELIVERED' && po.status !== 'APPROVED') {
      throw new BadRequestError('Only approved orders can be marked as delivered');
    }

    if (data.status === 'DELIVERED') {
      data.actualDelivery = new Date();
    }

    if (data.paidAmount !== undefined && data.totalAmount !== undefined) {
      const totalAmount = data.totalAmount ?? Number(po.totalAmount);
      const paidAmount = data.paidAmount;
      data.balanceAmount = totalAmount - paidAmount;

      if (paidAmount === 0) {
        data.paymentStatus = 'UNPAID';
      } else if (paidAmount >= totalAmount) {
        data.paymentStatus = 'PAID';
      } else {
        data.paymentStatus = 'PARTIAL';
      }
    }

    const updated = await purchaseOrderRepository.update(id, tenantId, data);
    await cacheService.deletePattern(`purchase-orders:${tenantId}:*`);
    return updated;
  }

  async deletePurchaseOrder(id: string, tenantId: string): Promise<void> {
    const po = await purchaseOrderRepository.findById(id, tenantId);
    if (!po) throw new NotFoundError('Purchase order not found');

    if (po.status === 'DELIVERED') {
      throw new BadRequestError('Cannot delete delivered purchase orders');
    }

    await purchaseOrderRepository.softDelete(id, tenantId);
    await cacheService.deletePattern(`purchase-orders:${tenantId}:*`);
  }

  async listPurchaseOrders(
    tenantId: string,
    filters: PurchaseOrderFilters,
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ orders: PurchaseOrder[]; total: number }> {
    const skip = (page - 1) * limit;
    const orderBy: Prisma.PurchaseOrderOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || 'desc' }
      : { orderDate: 'desc' };
    const [orders, total] = await Promise.all([
      purchaseOrderRepository.findAll(tenantId, filters, skip, limit, orderBy),
      purchaseOrderRepository.count(tenantId, filters),
    ]);
    return { orders, total };
  }

  async getPurchaseOrderStats(tenantId: string, startDate?: Date, endDate?: Date): Promise<PurchaseOrderStats> {
    return purchaseOrderRepository.getStats(tenantId, startDate, endDate);
  }
}

export default new PurchaseOrderService();
