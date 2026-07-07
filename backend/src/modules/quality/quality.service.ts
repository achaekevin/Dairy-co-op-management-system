import { ConflictError, NotFoundError } from '@core/errors.js';
import qualityRepository from './quality.repository.js';
import farmerRepository from '@modules/farmer/farmer.repository.js';
import cacheService from '@shared/services/cache.service.js';
import { Prisma } from '@prisma/client';
import {
  CreateQualityTestData,
  UpdateQualityTestData,
  QualityTestFilters,
  QualityTestStats,
  QualityTestResponse,
} from './quality.types.js';
import { QualityTest } from '@prisma/client';

class QualityService {
  async createQualityTest(
    tenantId: string,
    data: CreateQualityTestData
  ): Promise<QualityTest> {
    const existingTest = await qualityRepository.findByTestNumber(data.testNumber, tenantId);

    if (existingTest) {
      throw new ConflictError('Test number already exists');
    }

    if (data.farmerId) {
      const farmer = await farmerRepository.findById(data.farmerId, tenantId);
      if (!farmer) {
        throw new NotFoundError('Farmer not found');
      }
    }

    const overallResult = this.determineOverallResult(data);

    const test = await qualityRepository.create(tenantId, {
      ...data,
      overallResult,
    });

    await cacheService.deletePattern(`quality-tests:${tenantId}:*`);

    return test;
  }

  async getQualityTestById(id: string, tenantId: string): Promise<QualityTestResponse> {
    const cacheKey = `quality-test:${tenantId}:${id}`;
    const cached = await cacheService.get<QualityTestResponse>(cacheKey);

    if (cached) {
      return cached;
    }

    const test = await qualityRepository.findById(id, tenantId);

    if (!test) {
      throw new NotFoundError('Quality test not found');
    }

    const response = await this.formatTestResponse(test, tenantId);

    await cacheService.set(cacheKey, response, 1800);

    return response;
  }

  async updateQualityTest(
    id: string,
    tenantId: string,
    data: UpdateQualityTestData
  ): Promise<QualityTest> {
    const test = await qualityRepository.findById(id, tenantId);

    if (!test) {
      throw new NotFoundError('Quality test not found');
    }

    const updatedTest = await qualityRepository.update(id, tenantId, data);

    await cacheService.delete(`quality-test:${tenantId}:${id}`);
    await cacheService.deletePattern(`quality-tests:${tenantId}:*`);

    return updatedTest;
  }

  async deleteQualityTest(id: string, tenantId: string): Promise<void> {
    const test = await qualityRepository.findById(id, tenantId);

    if (!test) {
      throw new NotFoundError('Quality test not found');
    }

    await qualityRepository.softDelete(id, tenantId);

    await cacheService.delete(`quality-test:${tenantId}:${id}`);
    await cacheService.deletePattern(`quality-tests:${tenantId}:*`);
  }

  async approveQualityTest(id: string, tenantId: string, approvedBy: string): Promise<QualityTest> {
    const test = await qualityRepository.findById(id, tenantId);

    if (!test) {
      throw new NotFoundError('Quality test not found');
    }

    const approvedTest = await qualityRepository.approve(id, approvedBy);

    await cacheService.delete(`quality-test:${tenantId}:${id}`);
    await cacheService.deletePattern(`quality-tests:${tenantId}:*`);

    return approvedTest;
  }

  async listQualityTests(
    tenantId: string,
    filters: QualityTestFilters,
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ tests: QualityTestResponse[]; total: number }> {
    const cacheKey = `quality-tests:${tenantId}:${JSON.stringify({ filters, page, limit, sortBy, sortOrder })}`;
    const cached = await cacheService.get<{ tests: QualityTestResponse[]; total: number }>(cacheKey);

    if (cached) {
      return cached;
    }

    const skip = (page - 1) * limit;
    const orderBy: Prisma.QualityTestOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || 'desc' }
      : { date: 'desc', createdAt: 'desc' };

    const [tests, total] = await Promise.all([
      qualityRepository.findAll(tenantId, filters, skip, limit, orderBy),
      qualityRepository.count(tenantId, filters),
    ]);

    const formattedTests = await Promise.all(
      tests.map(test => this.formatTestResponse(test, tenantId))
    );

    const result = { tests: formattedTests, total };

    await cacheService.set(cacheKey, result, 300);

    return result;
  }

  async getQualityTestStats(
    tenantId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<QualityTestStats> {
    const cacheKey = `quality-test:stats:${tenantId}:${startDate?.toISOString()}:${endDate?.toISOString()}`;
    const cached = await cacheService.get<QualityTestStats>(cacheKey);

    if (cached) {
      return cached;
    }

    const stats = await qualityRepository.getStats(tenantId, startDate, endDate);

    await cacheService.set(cacheKey, stats, 900);

    return stats;
  }

  private determineOverallResult(data: CreateQualityTestData): string {
    if (
      data.alcoholTest === 'FAIL' ||
      data.cob === 'FAIL' ||
      data.coliformCount > 100
    ) {
      return 'FAIL';
    }

    if (
      data.fat < 3.0 ||
      data.snf < 8.0 ||
      data.pH < 6.4 ||
      data.pH > 6.8 ||
      data.mbrt < 180
    ) {
      return 'RETEST';
    }

    return 'PASS';
  }

  private async formatTestResponse(
    test: QualityTest,
    tenantId: string
  ): Promise<QualityTestResponse> {
    let farmerName: string | undefined;

    if (test.farmerId) {
      const farmer = await farmerRepository.findById(test.farmerId, tenantId);
      if (farmer) {
        farmerName = `${farmer.firstName} ${farmer.lastName}`;
      }
    }

    return {
      id: test.id,
      testNumber: test.testNumber,
      date: test.date,
      time: test.time,
      sampleType: test.sampleType,
      batchNumber: test.batchNumber || undefined,
      farmerId: test.farmerId || undefined,
      farmerName,
      testedBy: test.testedBy,
      fat: Number(test.fat),
      snf: Number(test.snf),
      protein: Number(test.protein),
      lactose: Number(test.lactose),
      temperature: Number(test.temperature),
      pH: Number(test.pH),
      acidity: Number(test.acidity),
      density: Number(test.density),
      alcoholTest: test.alcoholTest,
      cob: test.cob,
      mbrt: test.mbrt,
      coliformCount: test.coliformCount,
      overallResult: test.overallResult,
      status: test.status,
      remarks: test.remarks || undefined,
      approvedBy: test.approvedBy || undefined,
      approvedDate: test.approvedDate || undefined,
      createdAt: test.createdAt,
    };
  }
}

export default new QualityService();
