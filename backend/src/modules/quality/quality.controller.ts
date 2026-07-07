import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendPaginated } from '@core/response.js';
import qualityService from './quality.service.js';
import {
  CreateQualityTestData,
  UpdateQualityTestData,
  QualityTestFilters,
} from './quality.types.js';

class QualityController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantId!;
      const data: CreateQualityTestData = {
        ...req.body,
        date: new Date(req.body.date),
      };

      const test = await qualityService.createQualityTest(tenantId, data);

      sendCreated(res, test, 'Quality test created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId!;

      const test = await qualityService.getQualityTestById(id, tenantId);

      sendSuccess(res, test, 'Quality test retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId!;
      const data: UpdateQualityTestData = req.body;

      const test = await qualityService.updateQualityTest(id, tenantId, data);

      sendSuccess(res, test, 'Quality test updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId!;

      await qualityService.deleteQualityTest(id, tenantId);

      sendSuccess(res, null, 'Quality test deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async approve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId!;
      const { approvedBy } = req.body;

      const test = await qualityService.approveQualityTest(id, tenantId, approvedBy);

      sendSuccess(res, test, 'Quality test approved successfully');
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantId!;
      const {
        page = 1,
        limit = 20,
        sortBy,
        sortOrder,
        search,
        farmerId,
        sampleType,
        status,
        overallResult,
        startDate,
        endDate,
        testedBy,
      } = req.query;

      const filters: QualityTestFilters = {
        search: search as string,
        farmerId: farmerId as string,
        sampleType: sampleType as QualityTestFilters['sampleType'],
        status: status as QualityTestFilters['status'],
        overallResult: overallResult as QualityTestFilters['overallResult'],
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        testedBy: testedBy as string,
      };

      const { tests, total } = await qualityService.listQualityTests(
        tenantId,
        filters,
        Number(page),
        Number(limit),
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );

      sendPaginated(
        res,
        tests,
        Number(page),
        Number(limit),
        total,
        'Quality tests retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantId!;
      const { startDate, endDate } = req.query;

      const stats = await qualityService.getQualityTestStats(
        tenantId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      sendSuccess(res, stats, 'Quality test statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new QualityController();
