import api from './api';
import type { ApiResponse, PaginatedResponse, Employee } from '../types';

export interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  phoneNumber: string;
  email?: string;
  dateOfBirth: string;
  dateOfJoining: string;
  salary: number;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  aadharNumber: string;
  panNumber?: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  photo?: string;
}

export interface EmployeeFilters {
  search?: string;
  department?: string;
  designation?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const employeeService = {
  getAll: async (filters?: EmployeeFilters): Promise<ApiResponse<Employee[]>> => {
    const response = await api.get('/employees', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Employee>> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  create: async (data: CreateEmployeeData): Promise<ApiResponse<Employee>> => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateEmployeeData>): Promise<ApiResponse<Employee>> => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<{
    totalEmployees: number;
    activeEmployees: number;
    departments: number;
    totalSalary: number;
  }>> => {
    const response = await api.get('/employees/stats');
    return response.data;
  },
};
