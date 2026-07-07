import prisma from '@database/client.js';
import { QualityTest, Prisma } from '@prisma/client';
import {
  CreateQualityTestData,
  UpdateQualityTestData,
  QualityTestFilters,
} from './quality.types.js';

class QualityRepository {
  async create(
    tenantId: string,
    data: CreateQualityTestData & { overallResult: string }
  ): Promise<QualityTest> {
    return prisma.qualityTest.create({
      data: {
        tenantId,
        testNumber: data.testNumber,
        date: data.date,
        time: data.time,
        sampleType: data.sampleType,
        batchNumber: data.batchNumber,
        farmerId: data.farmerId,
        testedBy: data.testedBy,
        fat: data.fat,
        snf: data.snf,
        protein: data.protein,
        lactose: data.lactose,
        temperature: data.temperature,
        pH: data.pH,
        acidity: data.acidity,
        density: data.density,
        alcoholTest: data.alcoholTest,
        cob: data.cob,
        mbrt: data.mbrt,
        coliformCount: data.coliformCount,
        overallResult: data.overallResult as 'PASS' | 'FAIL' | 'RETEST',
        remarks: data.remarks,
        status: 'PENDING',
      },
    });
  }

  async findById(id: string, tenantId: string): Promise<QualityTest | null> {
    return prisma.qualityTest.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
    });
  }

  async findByTestNumber(testNumber: string, tenantId: string): Promise<QualityTest | null> {
    return prisma.qualityTest.findFirst({
      where: {
        testNumber,
        tenantId,
        deletedAt: null,
      },
    });
  }

  async update(
    id: string,
    _tenantId: string,
    data: UpdateQualityTestData
  ): Promise<QualityTest> {
    const updateData: Prisma.QualityTestUpdateInput = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.overallResult) {
      updateData.overallResult = data.overallResult as 'PASS' | 'FAIL' | 'RETEST';
    }

    if (data.status) {
      updateData.status = data.status as 'PENDING' | 'COMPLETED' | 'APPROVED' | 'REJECTED';
    }

    if (data.alcoholTest) {
      updateData.alcoholTest = data.alcoholTest as 'PASS' | 'FAIL';
    }

    if (data.cob) {
      updateData.cob = data.cob as 'PASS' | 'FAIL';
    }

    return prisma.qualityTest.update({
      where: { id },
      data: updateData,
    });
  }

  async softDelete(id: string, _tenantId: string): Promise<void> {
    await prisma.qualityTest.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async approve(id: string, approvedBy: string): Promise<QualityTest> {
    return prisma.qualityTest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy,
        approvedDate: new Date(),
      },
    });
  }

  async findAll(
    tenantId: string,
    filters: QualityTestFilters,
    skip: number,
    take: number,
    orderBy?: Prisma.QualityTestOrderByWithRelationInput
  ): Promise<QualityTest[]> {
    const where: Prisma.QualityTestWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (filters.search) {
      where.OR = [
        { testNumber: { contains: filters.search } },
        { batchNumber: { contains: filters.search } },
        { testedBy: { contains: filters.search } },
      ];
    }

    if (filters.farmerId) {
      where.farmerId = filters.farmerId;
    }

    if (filters.sampleType) {
      where.sampleType = filters.sampleType;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.overallResult) {
      where.overallResult = filters.overallResult;
    }

    if (filters.testedBy) {
      where.testedBy = { contains: filters.testedBy };
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    return prisma.qualityTest.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { date: 'desc', createdAt: 'desc' },
    });
  }

  async count(tenantId: string, filters: QualityTestFilters): Promise<number> {
    const where: Prisma.QualityTestWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (filters.search) {
      where.OR = [
        { testNumber: { contains: filters.search } },
        { batchNumber: { contains: filters.search } },
        { testedBy: { contains: filters.testedBy } },
      ];
    }

    if (filters.farmerId) {
      where.farmerId = filters.farmerId;
    }

    if (filters.sampleType) {
      where.sampleType = filters.sampleType;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.overallResult) {
      where.overallResult = filters.overallResult;
    }

    if (filters.testedBy) {
      where.testedBy = { contains: filters.testedBy };
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    return prisma.qualityTest.count({ where });
  }

  async getStats(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.QualityTestWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = startDate;
      }
      if (endDate) {
        where.date.lte = endDate;
      }
    }

    const [
      total,
      passed,
      failed,
      retest,
      pending,
      completed,
      approved,
      rejected,
      aggregates,
    ] = await Promise.all([
      prisma.qualityTest.count({ where }),
      prisma.qualityTest.count({ where: { ...where, overallResult: 'PASS' } }),
      prisma.qualityTest.count({ where: { ...where, overallResult: 'FAIL' } }),
      prisma.qualityTest.count({ where: { ...where, overallResult: 'RETEST' } }),
      prisma.qualityTest.count({ where: { ...where, status: 'PENDING' } }),
      prisma.qualityTest.count({ where: { ...where, status: 'COMPLETED' } }),
      prisma.qualityTest.count({ where: { ...where, status: 'APPROVED' } }),
      prisma.qualityTest.count({ where: { ...where, status: 'REJECTED' } }),
      prisma.qualityTest.aggregate({
        where,
        _avg: { fat: true, snf: true, protein: true, pH: true },
      }),
    ]);

    return {
      totalTests: total,
      passedTests: passed,
      failedTests: failed,
      retestRequired: retest,
      pendingTests: pending,
      completedTests: completed,
      approvedTests: approved,
      rejectedTests: rejected,
      avgFat: Number(aggregates._avg.fat) || 0,
      avgSnf: Number(aggregates._avg.snf) || 0,
      avgProtein: Number(aggregates._avg.protein) || 0,
      avgPH: Number(aggregates._avg.pH) || 0,
      passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
    };
  }
}

export default new QualityRepository();
