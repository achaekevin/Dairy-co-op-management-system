import api from './api';
import type { ApiResponse, Vehicle } from '../types';

export interface CreateVehicleData {
  vehicleNumber: string;
  vehicleType: 'MILK_TANKER' | 'DELIVERY_VAN' | 'TRUCK' | 'CAR' | 'BIKE';
  brand: string;
  model: string;
  capacity: number;
  fuelType: 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC';
  purchaseDate: string;
  insuranceExpiry: string;
  fitnessExpiry: string;
  lastService: string;
  nextService: string;
  currentMileage: number;
  driverName?: string;
}

export interface VehicleFilters {
  search?: string;
  vehicleType?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const vehicleService = {
  getAll: async (filters?: VehicleFilters): Promise<ApiResponse<Vehicle[]>> => {
    const response = await api.get('/vehicles', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Vehicle>> => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  create: async (data: CreateVehicleData): Promise<ApiResponse<Vehicle>> => {
    const response = await api.post('/vehicles', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateVehicleData>): Promise<ApiResponse<Vehicle>> => {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<{
    totalVehicles: number;
    activeVehicles: number;
    maintenanceVehicles: number;
    expiringInsurance: number;
  }>> => {
    const response = await api.get('/vehicles/stats');
    return response.data;
  },
};
