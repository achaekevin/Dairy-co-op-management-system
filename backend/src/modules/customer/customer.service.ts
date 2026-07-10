import { NotFoundError, ConflictError } from '@core/errors.js';
import customerRepository from './customer.repository.js';
import cacheService from '@shared/services/cache.service.js';
import { Prisma } from '@prisma/client';
import { CreateCustomerData, UpdateCustomerData, CustomerFilters, CustomerStats } from './customer.types.js';
import { Customer } from '@prisma/client';

class CustomerService {
  async createCustomer(tenantId: string, data: CreateCustomerData): Promise<Customer> {
    if (!data.customerId) {
      const count = await customerRepository.count(tenantId, {});
      data.customerId = `CUST-${String(count + 1).padStart(6, '0')}`;
    }

    const existing = await customerRepository.findByCustomerId(data.customerId, tenantId);
    if (existing) throw new ConflictError('Customer ID already exists');

    const customer = await customerRepository.create(tenantId, data as Required<CreateCustomerData>);
    await cacheService.deletePattern(`customers:${tenantId}:*`);
    return customer;
  }

  async getCustomerById(id: string, tenantId: string): Promise<Customer> {
    const customer = await customerRepository.findById(id, tenantId);
    if (!customer) throw new NotFoundError('Customer not found');
    return customer;
  }

  async updateCustomer(id: string, tenantId: string, data: UpdateCustomerData): Promise<Customer> {
    const customer = await customerRepository.findById(id, tenantId);
    if (!customer) throw new NotFoundError('Customer not found');

    const updated = await customerRepository.update(id, tenantId, data);
    await cacheService.deletePattern(`customers:${tenantId}:*`);
    return updated;
  }

  async deleteCustomer(id: string, tenantId: string): Promise<void> {
    const customer = await customerRepository.findById(id, tenantId);
    if (!customer) throw new NotFoundError('Customer not found');

    await customerRepository.softDelete(id, tenantId);
    await cacheService.deletePattern(`customers:${tenantId}:*`);
  }

  async listCustomers(
    tenantId: string,
    filters: CustomerFilters,
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ customers: Customer[]; total: number }> {
    const skip = (page - 1) * limit;
    const orderBy: Prisma.CustomerOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || 'desc' }
      : { createdAt: 'desc' };
    const [customers, total] = await Promise.all([
      customerRepository.findAll(tenantId, filters, skip, limit, orderBy),
      customerRepository.count(tenantId, filters),
    ]);
    return { customers, total };
  }

  async getCustomerStats(tenantId: string): Promise<CustomerStats> {
    return customerRepository.getStats(tenantId);
  }
}

export default new CustomerService();
