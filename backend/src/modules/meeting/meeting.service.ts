import { NotFoundError, ConflictError } from '@core/errors.js';
import meetingRepository from './meeting.repository.js';
import cacheService from '@shared/services/cache.service.js';
import { Prisma } from '@prisma/client';
import { CreateMeetingData, UpdateMeetingData, MeetingFilters, MeetingStats } from './meeting.types.js';
import { Meeting } from '@prisma/client';

class MeetingService {
  async createMeeting(tenantId: string, data: CreateMeetingData): Promise<Meeting> {
    const existing = await meetingRepository.findByMeetingNumber(data.meetingNumber, tenantId);
    if (existing) throw new ConflictError('Meeting number already exists');

    const meeting = await meetingRepository.create(tenantId, data);
    await cacheService.deletePattern(`meetings:${tenantId}:*`);
    return meeting;
  }

  async getMeetingById(id: string, tenantId: string): Promise<Meeting> {
    const meeting = await meetingRepository.findById(id, tenantId);
    if (!meeting) throw new NotFoundError('Meeting not found');
    return meeting;
  }

  async updateMeeting(id: string, tenantId: string, data: UpdateMeetingData): Promise<Meeting> {
    const meeting = await meetingRepository.findById(id, tenantId);
    if (!meeting) throw new NotFoundError('Meeting not found');

    const updated = await meetingRepository.update(id, tenantId, data);
    await cacheService.deletePattern(`meetings:${tenantId}:*`);
    return updated;
  }

  async deleteMeeting(id: string, tenantId: string): Promise<void> {
    const meeting = await meetingRepository.findById(id, tenantId);
    if (!meeting) throw new NotFoundError('Meeting not found');

    await meetingRepository.softDelete(id, tenantId);
    await cacheService.deletePattern(`meetings:${tenantId}:*`);
  }

  async listMeetings(
    tenantId: string,
    filters: MeetingFilters,
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ meetings: Meeting[]; total: number }> {
    const skip = (page - 1) * limit;
    const orderBy: Prisma.MeetingOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || 'desc' }
      : { date: 'desc' };
    const [meetings, total] = await Promise.all([
      meetingRepository.findAll(tenantId, filters, skip, limit, orderBy),
      meetingRepository.count(tenantId, filters),
    ]);
    return { meetings, total };
  }

  async getMeetingStats(tenantId: string, startDate?: Date, endDate?: Date): Promise<MeetingStats> {
    return meetingRepository.getStats(tenantId, startDate, endDate);
  }
}

export default new MeetingService();
