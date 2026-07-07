import prisma from '@database/client.js';
import { Meeting, Prisma } from '@prisma/client';
import { CreateMeetingData, UpdateMeetingData, MeetingFilters } from './meeting.types.js';

class MeetingRepository {
  async create(tenantId: string, data: CreateMeetingData): Promise<Meeting> {
    return prisma.meeting.create({
      data: {
        tenantId,
        ...data,
        totalAttendees: 0,
        status: 'SCHEDULED',
      },
    });
  }

  async findById(id: string, tenantId: string): Promise<Meeting | null> {
    return prisma.meeting.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }

  async findByMeetingNumber(meetingNumber: string, tenantId: string): Promise<Meeting | null> {
    return prisma.meeting.findFirst({
      where: { meetingNumber, tenantId, deletedAt: null },
    });
  }

  async update(id: string, _tenantId: string, data: UpdateMeetingData): Promise<Meeting> {
    const updateData: Prisma.MeetingUpdateInput = { ...data, updatedAt: new Date() };
    if (data.meetingType) updateData.meetingType = data.meetingType as 'BOARD' | 'GENERAL' | 'COMMITTEE' | 'SPECIAL' | 'AGM';
    if (data.status) updateData.status = data.status as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';
    return prisma.meeting.update({ where: { id }, data: updateData });
  }

  async softDelete(id: string, _tenantId: string): Promise<void> {
    await prisma.meeting.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async findAll(
    tenantId: string,
    filters: MeetingFilters,
    skip: number,
    take: number,
    orderBy?: Prisma.MeetingOrderByWithRelationInput
  ): Promise<Meeting[]> {
    const where: Prisma.MeetingWhereInput = { tenantId, deletedAt: null };
    if (filters.meetingType) where.meetingType = filters.meetingType;
    if (filters.status) where.status = filters.status;
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = filters.startDate;
      if (filters.endDate) where.date.lte = filters.endDate;
    }
    if (filters.search) {
      where.OR = [
        { meetingNumber: { contains: filters.search } },
        { title: { contains: filters.search } },
        { venue: { contains: filters.search } },
        { conductedBy: { contains: filters.search } },
      ];
    }
    return prisma.meeting.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { date: 'desc' },
    });
  }

  async count(tenantId: string, filters: MeetingFilters): Promise<number> {
    const where: Prisma.MeetingWhereInput = { tenantId, deletedAt: null };
    if (filters.meetingType) where.meetingType = filters.meetingType;
    if (filters.status) where.status = filters.status;
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = filters.startDate;
      if (filters.endDate) where.date.lte = filters.endDate;
    }
    if (filters.search) {
      where.OR = [
        { meetingNumber: { contains: filters.search } },
        { title: { contains: filters.search } },
        { venue: { contains: filters.search } },
        { conductedBy: { contains: filters.search } },
      ];
    }
    return prisma.meeting.count({ where });
  }

  async getStats(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.MeetingWhereInput = { tenantId, deletedAt: null };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }
    const [total, scheduled, completed, cancelled, postponed] = await Promise.all([
      prisma.meeting.count({ where }),
      prisma.meeting.count({ where: { ...where, status: 'SCHEDULED' } }),
      prisma.meeting.count({ where: { ...where, status: 'COMPLETED' } }),
      prisma.meeting.count({ where: { ...where, status: 'CANCELLED' } }),
      prisma.meeting.count({ where: { ...where, status: 'POSTPONED' } }),
    ]);
    return {
      totalMeetings: total,
      scheduledMeetings: scheduled,
      completedMeetings: completed,
      cancelledMeetings: cancelled,
      postponedMeetings: postponed,
    };
  }
}

export default new MeetingRepository();
