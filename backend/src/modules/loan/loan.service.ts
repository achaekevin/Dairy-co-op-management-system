import { NotFoundError, ConflictError, BadRequestError } from '@core/errors.js';
import loanRepository from './loan.repository.js';
import farmerRepository from '@modules/farmer/farmer.repository.js';
import cacheService from '@shared/services/cache.service.js';
import { Prisma } from '@prisma/client';
import { CreateLoanData, UpdateLoanData, LoanFilters, LoanStats } from './loan.types.js';
import { Loan } from '@prisma/client';

class LoanService {
  async createLoan(tenantId: string, data: CreateLoanData): Promise<Loan> {
    const farmer = await farmerRepository.findById(data.farmerId, tenantId);
    if (!farmer) throw new NotFoundError('Farmer not found');

    if (farmer.status !== 'ACTIVE') {
      throw new BadRequestError('Farmer is not active');
    }

    const existingLoan = await loanRepository.findByLoanNumber(data.loanNumber, tenantId);
    if (existingLoan) throw new ConflictError('Loan number already exists');

    const emiAmount = this.calculateEMI(data.amount, data.interestRate, data.tenure);
    const outstandingAmount = data.amount;

    const loan = await loanRepository.create(tenantId, { ...data, emiAmount, outstandingAmount });
    await cacheService.deletePattern(`loans:${tenantId}:*`);
    return loan;
  }

  async getLoanById(id: string, tenantId: string): Promise<Loan> {
    const loan = await loanRepository.findById(id, tenantId);
    if (!loan) throw new NotFoundError('Loan not found');
    return loan;
  }

  async updateLoan(id: string, tenantId: string, data: UpdateLoanData): Promise<Loan> {
    const loan = await loanRepository.findById(id, tenantId);
    if (!loan) throw new NotFoundError('Loan not found');

    if (data.status === 'APPROVED' && loan.status === 'PENDING') {
      data.approvedDate = new Date();
    }

    if (data.status === 'ACTIVE' && loan.status === 'APPROVED') {
      data.disbursementDate = new Date();
    }

    if (data.status === 'CLOSED' && loan.status === 'ACTIVE') {
      data.closureDate = new Date();
      data.outstandingAmount = 0;
    }

    const updated = await loanRepository.update(id, tenantId, data);
    await cacheService.deletePattern(`loans:${tenantId}:*`);
    return updated;
  }

  async deleteLoan(id: string, tenantId: string): Promise<void> {
    const loan = await loanRepository.findById(id, tenantId);
    if (!loan) throw new NotFoundError('Loan not found');

    if (loan.status === 'ACTIVE') {
      throw new BadRequestError('Cannot delete an active loan');
    }

    await loanRepository.softDelete(id, tenantId);
    await cacheService.deletePattern(`loans:${tenantId}:*`);
  }

  async listLoans(
    tenantId: string,
    filters: LoanFilters,
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ loans: Loan[]; total: number }> {
    const skip = (page - 1) * limit;
    const orderBy: Prisma.LoanOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || 'desc' }
      : { appliedDate: 'desc' };
    const [loans, total] = await Promise.all([
      loanRepository.findAll(tenantId, filters, skip, limit, orderBy),
      loanRepository.count(tenantId, filters),
    ]);
    return { loans, total };
  }

  async getLoanStats(tenantId: string, startDate?: Date, endDate?: Date): Promise<LoanStats> {
    return loanRepository.getStats(tenantId, startDate, endDate);
  }

  private calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
    const monthlyRate = annualRate / 12 / 100;
    if (monthlyRate === 0) return principal / tenureMonths;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return Math.round(emi * 100) / 100;
  }
}

export default new LoanService();
