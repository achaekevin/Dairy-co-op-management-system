import api from './api';
import type { ApiResponse, User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/auth/me', data);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },
};
