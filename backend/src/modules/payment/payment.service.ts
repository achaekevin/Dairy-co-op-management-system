import { NotFoundError } from '@core/errors.js';
import paymentRepository from './payment.repository.js';
import farmerRepository from '@modules/farmer/farmer.repository.js';
import cacheService from '@shared/services/cache.service.js';
import { Prisma } from '@prisma/client';
import { CreatePaymentData, UpdatePaymentData, PaymentFilters, PaymentStats } from './payment.types.js';
import { Payment } from '@prisma/client';

class PaymentService {
  async createPayment(tenantId: string, data: CreatePaymentData): Promise<Payment> {
    const farmer = await farmerRepository.findById(data.farmerId, tenantId);
    if (!farmer) throw new NotFoundError('Farmer not found');

    const netAmount = data.totalAmount + (data.bonusAmount || 0) - (data.deductionAmount || 0);
    const payment = await paymentRepository.create(tenantId, { ...data, netAmount });
    await cacheService.deletePattern(`payments:${tenantId}:*`);
    return payment;
  }

  async getPaymentById(id: string, tenantId: string): Promise<Payment> {
    const payment = await paymentRepository.findById(id, tenantId);
    if (!payment) throw new NotFoundError('Payment not found');
    return payment;
  }

  async updatePayment(id: string, tenantId: string, data: UpdatePaymentData): Promise<Payment> {
    const payment = await paymentRepository.findById(id, tenantId);
    if (!payment) throw new NotFoundError('Payment not found');
    const updated = await paymentRepository.update(id, tenantId, data);
    await cacheService.deletePattern(`payments:${tenantId}:*`);
    return updated;
  }

  async deletePayment(id: string, tenantId: string): Promise<void> {
    const payment = await paymentRepository.findById(id, tenantId);
    if (!payment) throw new NotFoundError('Payment not found');
    await paymentRepository.softDelete(id, tenantId);
    await cacheService.deletePattern(`payments:${tenantId}:*`);
  }

  async listPayments(
    tenantId: string,
    filters: PaymentFilters,
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ payments: Payment[]; total: number }> {
    const skip = (page - 1) * limit;
    const orderBy: Prisma.PaymentOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || 'desc' }
      : { createdAt: 'desc' };
    const [payments, total] = await Promise.all([
      paymentRepository.findAll(tenantId, filters, skip, limit, orderBy),
      paymentRepository.count(tenantId, filters),
    ]);
    return { payments, total };
  }

  async getPaymentStats(tenantId: string, startDate?: Date, endDate?: Date): Promise<PaymentStats> {
    return paymentRepository.getStats(tenantId, startDate, endDate);
  }
}

export default new PaymentService();
