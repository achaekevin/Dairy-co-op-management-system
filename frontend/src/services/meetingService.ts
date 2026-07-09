import api from './api';
import type { ApiResponse, PaginatedResponse, Meeting } from '../types';

export interface CreateMeetingData {
  title: string;
  meetingType: 'BOARD' | 'GENERAL' | 'COMMITTEE' | 'SPECIAL' | 'AGM';
  date: string;
  time: string;
  venue: string;
  agenda: string;
  conductedBy: string;
}

export interface MeetingFilters {
  search?: string;
  meetingType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export const meetingService = {
  getAll: async (filters?: MeetingFilters): Promise<ApiResponse<PaginatedResponse<Meeting>>> => {
    const response = await api.get('/meetings', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Meeting>> => {
    const response = await api.get(`/meetings/${id}`);
    return response.data;
  },

  create: async (data: CreateMeetingData): Promise<ApiResponse<Meeting>> => {
    const response = await api.post('/meetings', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateMeetingData>): Promise<ApiResponse<Meeting>> => {
    const response = await api.put(`/meetings/${id}`, data);
    return response.data;
  },

  complete: async (id: string, minutes: string, decisions: string, totalAttendees: number): Promise<ApiResponse<Meeting>> => {
    const response = await api.patch(`/meetings/${id}/complete`, { minutes, decisions, totalAttendees });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/meetings/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<{
    totalMeetings: number;
    scheduledMeetings: number;
    completedMeetings: number;
    upcomingMeetings: number;
  }>> => {
    const response = await api.get('/meetings/stats/summary');
    return response.data;
  },
};
