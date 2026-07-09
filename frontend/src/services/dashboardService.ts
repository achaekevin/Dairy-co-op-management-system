import api from './api';
import type { ApiResponse, DashboardStats } from '../types';

export interface DashboardAnalytics {
  milkCollection: {
    labels: string[];
    morning: number[];
    evening: number[];
  };
  revenue: {
    labels: string[];
    values: number[];
  };
  qualityDistribution: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
  recentActivities: Array<{
    id: string;
    action: string;
    user: string;
    timestamp: string;
    type: 'success' | 'info' | 'warning' | 'error';
  }>;
}

export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getAnalytics: async (period?: 'week' | 'month' | 'year'): Promise<ApiResponse<DashboardAnalytics>> => {
    const response = await api.get('/dashboard/analytics', { params: { period } });
    return response.data;
  },

  getRecentActivities: async (limit?: number): Promise<ApiResponse<DashboardAnalytics['recentActivities']>> => {
    const response = await api.get('/dashboard/activities', { params: { limit } });
    return response.data;
  },
};
