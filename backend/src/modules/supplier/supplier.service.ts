import { NotFoundError, ConflictError } from '@core/errors.js';
import supplierRepository from './supplier.repository.js';
import cacheService from '@shared/services/cache.service.js';
import { Prisma } from '@prisma/client';
import { CreateSupplierData, UpdateSupplierData, SupplierFilters, SupplierStats } from './supplier.types.js';
import { Supplier } from '@prisma/client';

class SupplierService {
  async createSupplier(tenantId: string, data: CreateSupplierData): Promise<Supplier> {
    const existing = await supplierRepository.findBySupplierCode(data.supplierCode, tenantId);
    if (existing) throw new ConflictError('Supplier code already exists');

    const supplier = await supplierRepository.create(tenantId, data);
    await cacheService.deletePattern(`suppliers:${tenantId}:*`);
    return supplier;
  }

  async getSupplierById(id: string, tenantId: string): Promise<Supplier> {
    const supplier = await supplierRepository.findById(id, tenantId);
    if (!supplier) throw new NotFoundError('Supplier not found');
    return supplier;
  }

  async updateSupplier(id: string, tenantId: string, data: UpdateSupplierData): Promise<Supplier> {
    const supplier = await supplierRepository.findById(id, tenantId);
    if (!supplier) throw new NotFoundError('Supplier not found');

    const updated = await supplierRepository.update(id, tenantId, data);
    await cacheService.deletePattern(`suppliers:${tenantId}:*`);
    return updated;
  }

  async deleteSupplier(id: string, tenantId: string): Promise<void> {
    const supplier = await supplierRepository.findById(id, tenantId);
    if (!supplier) throw new NotFoundError('Supplier not found');

    await supplierRepository.softDelete(id, tenantId);
    await cacheService.deletePattern(`suppliers:${tenantId}:*`);
  }

  async listSuppliers(
    tenantId: string,
    filters: SupplierFilters,
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ suppliers: Supplier[]; total: number }> {
    const skip = (page - 1) * limit;
    const orderBy: Prisma.SupplierOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || 'desc' }
      : { createdAt: 'desc' };
    const [suppliers, total] = await Promise.all([
      supplierRepository.findAll(tenantId, filters, skip, limit, orderBy),
      supplierRepository.count(tenantId, filters),
    ]);
    return { suppliers, total };
  }

  async getSupplierStats(tenantId: string): Promise<SupplierStats> {
    return supplierRepository.getStats(tenantId);
  }
}

export default new SupplierService();
