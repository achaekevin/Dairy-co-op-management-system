import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendPaginated } from '@core/response.js';
import meetingService from './meeting.service.js';

class MeetingController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meeting = await meetingService.createMeeting(req.tenantId!, req.body);
      sendCreated(res, meeting, 'Meeting created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meeting = await meetingService.getMeetingById(req.params.id, req.tenantId!);
      sendSuccess(res, meeting, 'Meeting retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meeting = await meetingService.updateMeeting(req.params.id, req.tenantId!, req.body);
      sendSuccess(res, meeting, 'Meeting updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await meetingService.deleteMeeting(req.params.id, req.tenantId!);
      sendSuccess(res, null, 'Meeting deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 20, sortBy, sortOrder, ...filters } = req.query;
      const { meetings, total } = await meetingService.listMeetings(
        req.tenantId!,
        filters,
        Number(page),
        Number(limit),
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );
      sendPaginated(res, meetings, Number(page), Number(limit), total);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const stats = await meetingService.getMeetingStats(
        req.tenantId!,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      sendSuccess(res, stats, 'Meeting statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new MeetingController();
